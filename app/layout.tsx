import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DigiLearn", template: "%s ? DigiLearn" },
  description: "Structured digital courses with practical lessons, knowledge checks, device-local notes and honest progress.",
  keywords: ["digital learning", "learn to code", "AI tools", "web development", "data skills", "cybersecurity"],
  openGraph: {
    title: "DigiLearn ? Practical digital learning",
    description: "Explore 72 structured courses with open lesson access, practice and device-local study notes.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
