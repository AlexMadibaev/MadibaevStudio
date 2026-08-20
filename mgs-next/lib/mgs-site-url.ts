export const mgsSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://madibaev.studio").replace(/\/$/, "");

export function mgsAbsoluteUrl(pathname: string) {
  return `${mgsSiteUrl}${pathname}`;
}
