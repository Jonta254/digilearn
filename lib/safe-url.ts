const ALLOWED_PROTOCOLS = new Set(["https:", "http:"]);

export function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.has(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function safeSiteUrl(value: string | undefined): URL {
  if (value && isSafeExternalUrl(value)) return new URL(value);
  return new URL("http://localhost:3000");
}
