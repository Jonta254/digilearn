"use client";
import { BrandLogo } from "@/components/BrandLogo";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="route-state"><BrandLogo /><p className="eyebrow">Something went wrong</p><h1>This page could not be displayed.</h1><p>Your device-local notes and progress have not been intentionally changed. Try loading the page again.</p><button className="button primary" type="button" onClick={reset}>Try again</button></main>; }
