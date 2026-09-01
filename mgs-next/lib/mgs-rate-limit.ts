type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

function sweepExpired(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function trustCloudflareHeader() {
  const value = process.env.MGS_TRUST_CLOUDFLARE?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function getRequestIp(request: Request) {
  if (trustCloudflareHeader()) {
    const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
    if (cloudflareIp) return cloudflareIp;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((value) => value.trim()).filter(Boolean);
    if (parts.length) return parts[0];
  }

  return "unknown";
}

export function takeRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  sweepExpired(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + options.windowMs };
    buckets.set(key, bucket);
    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      resetAt: bucket.resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, options.limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: 0,
  };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}

export function rateLimitHeaders(result: ReturnType<typeof takeRateLimit>) {
  return {
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.allowed ? {} : { "Retry-After": String(result.retryAfterSeconds) }),
  };
}
