"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";

const NAV_ITEMS = [
  { href: "/courses", label: "Courses" },
  { href: "/practice", label: "Practice" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Access" },
] as const;

function PrimaryLinks() {
  const pathname = usePathname();
  return NAV_ITEMS.map((item) => {
    const active = pathname === item.href || (item.href === "/courses" && pathname.startsWith("/courses/"));
    return <Link key={item.href} href={item.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>{item.label}</Link>;
  });
}

export function SiteHeader() {
  return <header className="site-header"><a className="skip-link" href="#main-content">Skip to content</a><Link href="/" className="site-brand" aria-label="DigiLearn home"><BrandLogo compact /></Link><nav className="desktop-nav" aria-label="Primary"><PrimaryLinks /></nav><details className="mobile-nav"><summary>Browse</summary><nav aria-label="Mobile"><PrimaryLinks /></nav></details><Link href="/courses" className="header-action">Start learning</Link></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div><Link href="/" className="site-brand" aria-label="DigiLearn home"><BrandLogo tone="light" /></Link><p>Practical digital learning with progress and notes stored on this device.</p></div><nav aria-label="Footer"><Link href="/courses">Course catalogue</Link><Link href="/practice">Practice decks</Link><Link href="/dashboard">Learning dashboard</Link><Link href="/pricing">Learning access</Link></nav><p className="footer-note">No cloud sync yet. Clearing browser storage may remove local learning records.</p></footer>;
}
