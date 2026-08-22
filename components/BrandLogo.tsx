type Tone = "color" | "light" | "dark" | "mono";

export function LogoSymbol({ size = 40, tone = "color", label }: { size?: number; tone?: Tone; label?: string }) {
  const ink = tone === "light" ? "#ffffff" : tone === "mono" ? "currentColor" : "#12304a";
  const accent = tone === "light" ? "#9ee7e5" : tone === "mono" ? "currentColor" : "#0f9fa8";
  return <svg className="logo-symbol" width={size} height={size} viewBox="0 0 48 48" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
    <path d="M5 9.5c6.2-1 12.4.6 19 5.4v26.2C17.6 36.4 11.2 34.8 5 35.8V9.5Z" fill={tone === "dark" ? "#edf8f8" : ink} />
    <path d="M43 9.5c-6.2-1-12.4.6-19 5.4v26.2c6.4-4.7 12.8-6.3 19-5.3V9.5Z" fill={tone === "dark" ? "#d8eeee" : "#dcebed"} />
    <path d="M24 14.9v26.2" stroke={accent} strokeWidth="2.2" />
    <path d="M29 31h4v-4h4v-5h5" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>;
}

export function BrandLogo({ compact = false, tone = "color" }: { compact?: boolean; tone?: Tone }) {
  return <span className={compact ? "brand-logo compact" : "brand-logo"}><LogoSymbol size={compact ? 30 : 38} tone={tone} /><span className="brand-wordmark">DigiLearn</span></span>;
}
