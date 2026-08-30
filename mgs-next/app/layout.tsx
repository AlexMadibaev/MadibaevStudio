import type { Metadata } from "next";
import { Inter, Roboto_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";
import "./mgs.css";
import "./mgs-routes.css";
import "./mgs-polish.css";
import "./mgs-clean.css";
import "./mgs-home-live.css";
import "./mgs-runtime-fixes.css";
import { cn } from "@/lib/utils";
import { mgsSiteUrl } from "@/lib/mgs-site-url";
import { MgsRuntimeEnhancements } from "@/components/mgs-runtime-enhancements";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(mgsSiteUrl),
  title: "Madibaev Graphic Studio — Design & Digital Studio",
  description: "Madibaev Graphic Studio combines strategy, branding, web development, UI/UX and visual communication to take business challenges from concept to launch.",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    title: "MGS",
  },
  manifest: "/site.webmanifest",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${mgsSiteUrl}/#organization`,
      name: "Madibaev Graphic Studio",
      url: mgsSiteUrl,
      logo: `${mgsSiteUrl}/apple-touch-icon.png`,
      email: "info@madibaevstudio.online",
      founder: { "@id": `${mgsSiteUrl}/#alexander-madibaev` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dushanbe",
        addressCountry: "TJ",
      },
      sameAs: [
        "https://t.me/madibaevstudio",
        "https://instagram.com/madibaevstudio",
      ],
    },
    {
      "@type": "Person",
      "@id": `${mgsSiteUrl}/#alexander-madibaev`,
      name: "Alexander Madibaev",
      jobTitle: "Founder and Creative Director",
      worksFor: { "@id": `${mgsSiteUrl}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${mgsSiteUrl}/#website`,
      name: "Madibaev Graphic Studio",
      url: mgsSiteUrl,
      inLanguage: ["ru", "en"],
      publisher: { "@id": `${mgsSiteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={cn("dark", "h-full", "antialiased", inter.variable, spaceGrotesk.variable, robotoMono.variable)}>
      <body className={cn("min-h-full", inter.className)}>
        {children}
        <MgsRuntimeEnhancements />
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />
      </body>
    </html>
  );
}
