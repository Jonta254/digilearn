import type { Metadata, Viewport } from "next";
import { OfflineNotice } from "@/components/OfflineNotice";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ["digital learning", "learn to code", "AI tools", "web development", "data skills", "cybersecurity"],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, type: "website", url: "/", siteName: SITE_NAME, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_DESCRIPTION }] },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION, images: ["/twitter-image"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f8f8" }, { media: "(prefers-color-scheme: dark)", color: "#12304a" }], colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><OfflineNotice />{children}</body></html>;
}
