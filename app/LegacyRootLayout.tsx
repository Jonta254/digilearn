import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DigiLearn", template: "%s · DigiLearn" },
  description: "Master coding, AI tools, automation, data science, cybersecurity, and every digital skill that shapes the modern world. Real projects, real outcomes.",
  keywords: ["learn AI", "learn to code", "prompt engineering", "ChatGPT mastery", "AI tools", "web development course", "digital skills", "automation no-code", "python data science"],
  openGraph: {
    title: "DigiLearn — Master the Skills That Define the Future",
    description: "Code, AI, automation, data science and more — everything a modern digital human needs.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
