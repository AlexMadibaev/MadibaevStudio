import { NextResponse } from "next/server";

import { getMgsContentStoreStatus } from "@/lib/mgs-content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const storage = getMgsContentStoreStatus();
  const healthy = storage.connected;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      storage: healthy ? "connected" : "unavailable",
      uptimeSeconds: Math.floor(process.uptime()),
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
