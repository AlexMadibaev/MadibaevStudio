import type { Metadata } from "next";
import { DM_Mono, Manrope } from "next/font/google";

import "./globals.css";
import "./mgs.css";
import "./mgs-routes.css";
import { cn } from "@/lib/utils";
import { mgsSiteUrl } from "@/lib/mgs-site-url";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(mgsSiteUrl),
  title: "Madibaev Graphic Studio — дизайн-студия",
  description: "Madibaev Graphic Studio — независимая студия брендинга и digital-дизайна: визуальные системы, сайты и интерфейсы.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${mgsSiteUrl}/#organization`,
      name: "Madibaev Graphic Studio",
      url: mgsSiteUrl,
      logo: `${mgsSiteUrl}/mgs-logo.svg`,
      email: "hello@madibaev.studio",
      founder: { "@id": `${mgsSiteUrl}/#alexander-madibaev` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dushanbe",
        addressCountry: "TJ",
      },
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
    <html lang="ru" className={cn("dark", "h-full", "antialiased", manrope.variable, dmMono.variable)}>
      <body className="min-h-full">
        {children}
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />
      </body>
    </html>
  );
}
