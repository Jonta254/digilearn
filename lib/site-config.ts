import { safeSiteUrl } from "./safe-url";

export const SITE_NAME = "DigiLearn";
export const SITE_DESCRIPTION = "Practical digital learning, structured for progress.";
export const SITE_URL = safeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
