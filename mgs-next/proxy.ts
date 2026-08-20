import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = "madibaevstudio.online";

const SUBDOMAIN_ROUTES: Record<string, string> = {
  work: "/work",
  services: "/services",
  about: "/about",
};

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];

  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  const subdomain = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
  const basePath = SUBDOMAIN_ROUTES[subdomain];

  if (!basePath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `${basePath}${suffix}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
