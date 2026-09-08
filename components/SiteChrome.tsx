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
  return <header className="site-header"><a className="skip-link" href="#main-content">Skip to content</a><Link href="/" className="site-brand" aria-label="DigiLearn home"><BrandLogo compact /></Link><nav className="desktop-nav" aria-label="Primary"><PrimaryLinks /></nav><details className="mobile-nav"><summary><span>Menu</span><span className="menu-icon" aria-hidden="true" /></summary><nav aria-label="Mobile"><PrimaryLinks /><Link href="/courses" className="mobile-primary-action">Start learning</Link></nav></details><Link href="/courses" className="header-action">Start learning</Link></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-grid"><div className="footer-brand"><Link href="/" className="site-brand" aria-label="DigiLearn home"><BrandLogo tone="light" /></Link><p>Practical digital learning for people building useful, reviewable work.</p><span>Progress and notes stay on this device.</span></div><nav aria-label="Learn"><strong>Learn</strong><Link href="/courses">Courses</Link><Link href="/practice">Practice</Link><Link href="/dashboard">Dashboard</Link></nav><nav aria-label="Platform"><strong>Platform</strong><Link href="/pricing">Access</Link><Link href="/courses/html-css/guide">Study guides</Link><Link href="/auth">Device profile</Link></nav><div className="footer-information"><strong>Important information</strong><p>DigiLearn is in an open-access stage. Course review status and source notes are shown with the learning material.</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} DigiLearn</span><span>No cloud sync or active payment processing.</span></div></footer>;
}
