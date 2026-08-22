import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function SiteHeader() {
  return <header className="site-header"><a className="skip-link" href="#main-content">Skip to content</a><Link href="/" className="site-brand" aria-label="DigiLearn home"><BrandLogo compact /></Link><nav className="desktop-nav" aria-label="Primary"><Link href="/courses">Courses</Link><Link href="/practice">Practice</Link><Link href="/dashboard">Dashboard</Link><Link href="/pricing">Access</Link></nav><details className="mobile-nav"><summary>Menu</summary><nav aria-label="Mobile"><Link href="/courses">Courses</Link><Link href="/practice">Practice</Link><Link href="/dashboard">Dashboard</Link><Link href="/pricing">Access</Link></nav></details><Link href="/courses" className="header-action">Start learning</Link></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div><Link href="/" className="site-brand" aria-label="DigiLearn home"><BrandLogo tone="light" /></Link><p>Practical digital learning with progress and notes stored on this device.</p></div><nav aria-label="Footer"><Link href="/courses">Course catalogue</Link><Link href="/practice">Practice decks</Link><Link href="/dashboard">Learning dashboard</Link><Link href="/pricing">Learning access</Link></nav><p className="footer-note">No cloud sync yet. Clearing browser storage may remove local learning records.</p></footer>;
}
