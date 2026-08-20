export const mgsSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://madibaevstudio.online").replace(/\/$/, "");

export function mgsAbsoluteUrl(pathname: string) {
  return `${mgsSiteUrl}${pathname}`;
}
