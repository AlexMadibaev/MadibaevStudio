import type { Metadata } from "next";
import { Fira_Sans, Montserrat, Unbounded } from "next/font/google";
import type { CSSProperties } from "react";

import "./globals.css";
import "./mgs.css";
import "./mgs-routes.css";
import "./mgs-polish.css";
import "./mgs-clean.css";
import "./mgs-home-live.css";
import "./mgs-runtime-fixes.css";
import "./mgs-service-typography-fixes.css";
import "./mgs-typography.css";
import "./mgs-nav-clean.css";
import "./mgs-heading-intro.css";
import { cn } from "@/lib/utils";
import { mgsSiteUrl } from "@/lib/mgs-site-url";
import { MgsRuntimeEnhancements } from "@/components/mgs-runtime-enhancements";
import { MgsHeadingIntros } from "@/components/mgs-heading-intros";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-fira-sans",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

const fontAliases = {
  "--font-inter": "var(--font-fira-sans)",
  "--font-space-grotesk": "var(--font-unbounded)",
  "--font-roboto-mono": "var(--font-fira-sans)",
  "--font-dm-mono": "var(--font-fira-sans)",
  "--font-mono": "var(--font-fira-sans)",
  "--font-lato": "var(--font-fira-sans)",
} as CSSProperties;

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
    <html
      lang="ru"
      className={cn("dark", "h-full", "antialiased", montserrat.variable, firaSans.variable, unbounded.variable)}
      style={fontAliases}
    >
      <body className={cn("min-h-full", firaSans.className)}>
        {children}
        <MgsRuntimeEnhancements />
        <MgsHeadingIntros />
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />
      </body>
    </html>
  );
}
