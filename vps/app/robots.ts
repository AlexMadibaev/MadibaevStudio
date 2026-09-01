import type { MetadataRoute } from "next";

import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: mgsAbsoluteUrl("/sitemap.xml"),
  };
}
