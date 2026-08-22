import type { Metadata } from "next";
export const metadata: Metadata = { title: "Local profile", description: "Open or create a browser-local DigiLearn profile. No cloud account or recovery is provided.", alternates: { canonical: "/auth" }, robots: { index: false, follow: true } };
export default function AuthLayout({ children }: { children: React.ReactNode }) { return children; }
