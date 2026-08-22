import type { Metadata } from "next";
export const metadata: Metadata = { title: "Practice decks", description: "Review eight DigiLearn practice decks with deterministic device-local Leitner progress.", alternates: { canonical: "/practice" } };
export default function PracticeLayout({ children }: { children: React.ReactNode }) { return children; }
