"use client";
import { BrandLogo } from "@/components/BrandLogo";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="route-state"><BrandLogo /><p className="eyebrow">Application error</p><h1>DigiLearn could not finish loading.</h1><p>No backend account or cloud copy exists. Reload the application; device-local records are not intentionally modified by this screen.</p><button className="button primary" type="button" onClick={reset}>Reload DigiLearn</button></main></body></html>;
}
