import { safeSiteUrl } from "./safe-url";

export const SITE_NAME = "DigiLearn";
export const SITE_DESCRIPTION = "Practical digital learning, structured for progress.";
// Keep generated canonicals, sitemap entries and social metadata production-safe
// even when a deployment environment has not supplied the optional override.
export const SITE_URL = safeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://digilearn-five.vercel.app",
);
