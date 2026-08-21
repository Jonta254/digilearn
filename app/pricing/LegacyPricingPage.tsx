"use client";
import { useState } from "react";
import Link from "next/link";

function DigiLearnLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="url(#dlp-bg)"/>
      <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.3" strokeDasharray="4 2"/>
      <circle cx="20" cy="9"  r="3.5" fill="url(#dlp-n1)"/>
      <circle cx="9"  cy="27" r="3.5" fill="url(#dlp-n2)"/>
      <circle cx="31" cy="27" r="3.5" fill="url(#dlp-n3)"/>
      <circle cx="20" cy="20" r="2.5" fill="white" fillOpacity="0.9"/>
      <line x1="20" y1="12.5" x2="11"  y2="25"  stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="20" y1="12.5" x2="29"  y2="25"  stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="12.5" y1="27" x2="27.5" y2="27" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <defs>
        <linearGradient id="dlp-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#0284C7"/><stop offset="100%" stopColor="#0369A1"/>
        </linearGradient>
        <radialGradient id="dlp-n1"><stop offset="0%" stopColor="#7DD3FC"/><stop offset="100%" stopColor="#38BDF8"/></radialGradient>
        <radialGradient id="dlp-n2"><stop offset="0%" stopColor="#FED7AA"/><stop offset="100%" stopColor="#FB923C"/></radialGradient>
        <radialGradient id="dlp-n3"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#A78BFA"/></radialGradient>
      </defs>
    </svg>
  );
}

const FAQS = [
  { q:"Can I cancel anytime?", a:"Yes. You can cancel your subscription at any time from your billing settings. You keep full access until the end of your billing period — no partial refunds, no questions asked." },
  { q:"Is there a free trial for Pro?", a:"We offer a 7-day free trial on all new Pro subscriptions. Your card is only charged after the trial ends, and you can cancel before that with no charge." },
  { q:"What payment methods do you accept?", a:"We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay / Google Pay on mobile. All payments are secured with SSL encryption via Stripe." },
  { q:"What's the difference between Pro and Team?", a:"Pro is for individual learners. Team adds group billing, a manager dashboard to track team progress, bulk seat purchasing (minimum 5 seats), and dedicated onboarding support." },
  { q:"Do I get a certificate?", a:"Yes — Pro and Team members receive a verifiable digital certificate for each completed course. Certificates include a unique credential ID you can share on LinkedIn." },
  { q:"Can I switch plans?", a:"Absolutely. You can upgrade or downgrade anytime. Upgrades take effect immediately and we prorate the cost. Downgrades take effect at your next billing cycle." },
  { q:"Is my data safe?", a:"DigiLearn uses bank-level encryption (TLS 1.3), daily encrypted backups, and never sells your data. We're GDPR compliant and provide a data export tool in your account settings." },
];

const COMPARE = [
  { category:"Content Access" },
  { feature:"Free courses",     free:"5 courses",   pro:"800+ lessons",   team:"800+ lessons" },
  { feature:"Learning paths",   free:false,          pro:true,             team:true },
  { feature:"New releases",     free:"60-day delay", pro:"Day 1 access",   team:"Day 1 access" },
  { feature:"Downloadable resources", free:false,   pro:true,             team:true },
  { category:"Learning Tools" },
  { feature:"Progress tracking",       free:true,   pro:true,             team:true },
  { feature:"AI study assistant",      free:false,  pro:true,             team:true },
  { feature:"Code sandbox",            free:"Basic", pro:"Full access",   team:"Full access" },
  { feature:"Offline access",          free:false,  pro:true,             team:true },
  { feature:"Completion certificates", free:false,  pro:true,             team:true },
  { category:"Career & Community" },
  { feature:"Community Discord",       free:true,   pro:true,             team:true },
  { feature:"Ask-the-instructor",      free:false,  pro:true,             team:true },
  { feature:"Project feedback",        free:false,  pro:true,             team:true },
  { feature:"Job board access",        free:false,  pro:true,             team:true },
  { feature:"LinkedIn certificate",    free:false,  pro:true,             team:true },
  { category:"Team Features" },
  { feature:"Team dashboard",          free:false,  pro:false,            team:true },
  { feature:"Bulk seat management",    free:false,  pro:false,            team:true },
  { feature:"Usage analytics",         free:false,  pro:false,            team:true },
  { feature:"Dedicated support",       free:false,  pro:"Email",          team:"Priority + Slack" },
  { feature:"Custom learning paths",   free:false,  pro:false,            team:true },
];

function CellVal({ v }: { v: boolean | string }) {
  if (v === true)  return <span className="check-y">✓</span>;
  if (v === false) return <span className="check-n">—</span>;
  return <span className="check-txt">{v}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const proMonth  = annual ? 13 : 16;
  const teamMonth = annual ? 10 : 12;
  const proOrig   = annual ? 16 : null;
  const teamOrig  = annual ? 12 : null;

  return (
    <div style={{ background:"var(--bg)", color:"var(--text)", minHeight:"100svh" }}>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo" style={{ textDecoration:"none" }}>
          <DigiLearnLogo size={30} />
          <span style={{ fontWeight:800, fontSize:"1rem", color:"var(--text)" }}>DigiLearn</span>
        </Link>
        <div className="nav-links">
          <Link href="/#tracks" className="nav-link">Tracks</Link>
          <Link href="/#courses" className="nav-link">Courses</Link>
          <Link href="/pricing" className="nav-link active">Pricing</Link>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Link href="/auth?mode=login" className="btn-ghost" style={{ padding:"0.45rem 1.1rem", fontSize:"0.8rem", minHeight:36 }}>Sign in</Link>
          <Link href="/auth?mode=signup" className="nav-cta">Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pricing-hero">
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div className="hero-badge" style={{ marginBottom:"1.25rem" }}>
            <span className="hero-badge-dot" />
            Simple, transparent pricing
          </div>
          <h1 style={{ fontSize:"clamp(2.25rem,6vw,4rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.05, marginBottom:"1rem" }}>
            Invest in skills that<br/>
            <span className="cyan-text">actually pay off</span>
          </h1>
          <p style={{ fontSize:"1.05rem", color:"var(--text-dim)", lineHeight:1.8, maxWidth:520, margin:"0 auto" }}>
            Join 52,000+ learners mastering AI, coding, and automation. Start free, upgrade when you&apos;re ready.
          </p>

          {/* Billing toggle */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginTop:"2rem" }}>
            <div className="billing-toggle">
              <button className={`billing-option ${!annual ? "active" : ""}`} onClick={() => setAnnual(false)}>
                Monthly
              </button>
              <button className={`billing-option ${annual ? "active" : ""}`} onClick={() => setAnnual(true)}>
                Annual <span className="annual-badge">Save 20%</span>
              </button>
            </div>
            {annual && (
              <p style={{ fontSize:"0.78rem", color:"var(--green)", fontWeight:600, marginTop:4 }}>
                ✓ Annual billing — save up to $36/year vs monthly
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section style={{ padding:"0 1.5rem 5rem", background:"var(--bg)" }}>
        <div className="plan-grid">

          {/* FREE */}
          <div className="plan-card">
            <div className="plan-name">Free</div>
            <div className="plan-price">
              <span className="plan-price-amount">$0</span>
              <span className="plan-price-period">/month</span>
            </div>
            <p className="plan-desc">The best way to try DigiLearn. No card required, no time limit.</p>
            <ul className="plan-features">
              {[
                "Access to 5 starter courses",
                "Community Discord access",
                "Basic progress tracking",
                "Mobile-friendly interface",
                "Limited AI tool guides",
              ].map(f => (
                <li key={f}>
                  <span className="plan-check yes">✓</span>
                  {f}
                </li>
              ))}
              {["Certificates","AI study assistant","Downloadable resources","Job board"].map(f => (
                <li key={f} className="dimmed">
                  <span className="plan-check no">—</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth?mode=signup" className="btn-secondary" style={{ width:"100%", justifyContent:"center" }}>
              Start for free
            </Link>
          </div>

          {/* PRO */}
          <div className="plan-card plan-popular">
            <div className="plan-popular-badge">MOST POPULAR</div>
            <div className="plan-name" style={{ color:"var(--cyan)", marginTop:"0.5rem" }}>Pro</div>
            <div className="plan-price">
              <span className="plan-price-amount" style={{ color:"var(--cyan)" }}>${proMonth}</span>
              <span className="plan-price-period">/month</span>
            </div>
            {proOrig && (
              <div className="plan-price-original">Was ${proOrig}/mo · billed as ${proMonth * 12}/yr</div>
            )}
            <p className="plan-desc">Everything you need to go from beginner to job-ready, fast.</p>
            <ul className="plan-features">
              {[
                "800+ lessons across all tracks",
                "8 structured learning paths",
                "AI study assistant (unlimited)",
                "Completion certificates",
                "Offline access on mobile",
                "Downloadable resources & projects",
                "Ask-the-instructor (Q&A)",
                "LinkedIn-shareable credentials",
                "Job board & career resources",
                "Day-1 access to new courses",
              ].map(f => (
                <li key={f}>
                  <span className="plan-check yes">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth?mode=signup" className="btn-primary" style={{ width:"100%", justifyContent:"center", background:"var(--cyan)" }}>
              Start 7-day free trial →
            </Link>
            <p style={{ fontSize:"0.72rem", color:"var(--text-mute)", textAlign:"center", marginTop:"0.75rem" }}>
              No card required for trial · Cancel anytime
            </p>
          </div>

          {/* TEAM */}
          <div className="plan-card">
            <div className="plan-name">Team</div>
            <div className="plan-price">
              <span className="plan-price-amount">${teamMonth}</span>
              <span className="plan-price-period">/seat/mo</span>
            </div>
            {teamOrig && (
              <div className="plan-price-original">Was ${teamOrig}/seat/mo · min 5 seats</div>
            )}
            <p className="plan-desc">Upskill your entire team with progress tracking and a manager dashboard.</p>
            <ul className="plan-features">
              {[
                "Everything in Pro",
                "Team manager dashboard",
                "Bulk seat billing (min 5 seats)",
                "Learning path assignments",
                "Team progress analytics",
                "Custom learning paths",
                "Priority email + Slack support",
                "Dedicated onboarding call",
                "SAML SSO (10+ seats)",
                "Invoice billing available",
              ].map(f => (
                <li key={f}>
                  <span className="plan-check yes">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="mailto:teams@digilearn.app?subject=Team Plan Inquiry"
              className="btn-secondary"
              style={{ width:"100%", justifyContent:"center" }}
            >
              Contact sales →
            </a>
            <p style={{ fontSize:"0.72rem", color:"var(--text-mute)", textAlign:"center", marginTop:"0.75rem" }}>
              Custom quotes for 20+ seats
            </p>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="trust-badges">
        {[
          { icon:"🔒", text:"SSL secured payments" },
          { icon:"↩️", text:"30-day money-back guarantee" },
          { icon:"❌", text:"Cancel anytime, instantly" },
          { icon:"📜", text:"Verified certificates" },
          { icon:"🌍", text:"50,000+ learners worldwide" },
        ].map(b => (
          <div key={b.text} className="trust-badge">
            <div className="trust-badge-icon">{b.icon}</div>
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      {/* FEATURE COMPARISON TABLE */}
      <section style={{ padding:"5rem 0", background:"var(--bg2)" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem", padding:"0 1.5rem" }}>
          <div className="section-tag tag-cyan" style={{ margin:"0 auto 1rem" }}>Compare plans</div>
          <h2 className="section-title" style={{ margin:"0 auto" }}>Everything side by side</h2>
        </div>
        <div className="compare-section">
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th><span className="plan-col-head">Free</span></th>
                  <th><span className="plan-col-head highlight">Pro</span></th>
                  <th><span className="plan-col-head">Team</span></th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => {
                  if ("category" in row) {
                    return (
                      <tr key={i} className="compare-category">
                        <td colSpan={4}>{row.category}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i}>
                      <td className="feature-name">{row.feature}</td>
                      <td><CellVal v={row.free} /></td>
                      <td><CellVal v={row.pro} /></td>
                      <td><CellVal v={row.team} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg)" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-tag tag-orange" style={{ margin:"0 auto 1rem" }}>What learners say</div>
          <h2 className="section-title" style={{ margin:"0 auto" }}>Pro members get results</h2>
        </div>
        <div className="testi-grid" style={{ maxWidth:1000, margin:"0 auto" }}>
          {[
            { quote:"I went from zero to landing my first freelance AI automation client within 6 weeks of going Pro. The structured paths are everything.", name:"Maria T.", role:"Freelance AI Consultant", init:"MT", color:"var(--cyan)" },
            { quote:"The certificates helped me get interviews — three companies asked about my DigiLearn credentials. Worth every cent of the Pro plan.", name:"James O.", role:"Junior Developer, Fintech startup", init:"JO", color:"var(--orange)" },
            { quote:"I've tried Coursera, Udemy, and others. DigiLearn's AI track is the most practical and up-to-date I've found anywhere. Pro is a no-brainer.", name:"Sandra K.", role:"Product Manager turned AI builder", init:"SK", color:"var(--violet)" },
          ].map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background:`linear-gradient(135deg,${t.color},${t.color}99)` }}>{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg2)" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-tag tag-violet" style={{ margin:"0 auto 1rem" }}>FAQ</div>
          <h2 className="section-title" style={{ margin:"0 auto" }}>Common questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                <span>{faq.q}</span>
                <div className="faq-icon">+</div>
              </button>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"5rem 1.5rem", textAlign:"center", background:"linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)" }}>
        <h2 style={{ fontSize:"clamp(1.75rem,4vw,3rem)", fontWeight:900, letterSpacing:"-0.04em", marginBottom:"1rem" }}>
          Ready to level up your skills?
        </h2>
        <p style={{ fontSize:"1rem", color:"var(--text-dim)", maxWidth:480, margin:"0 auto 2rem", lineHeight:1.8 }}>
          Start free today. No credit card required. Upgrade to Pro when you&apos;re ready to unlock everything.
        </p>
        <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/auth?mode=signup" className="btn-primary" style={{ fontSize:"1rem", padding:"1rem 2.5rem" }}>
            Get started free →
          </Link>
          <Link href="/auth?mode=signup" className="btn-secondary" style={{ fontSize:"1rem", padding:"1rem 2.5rem" }}>
            Start Pro trial
          </Link>
        </div>
        <p style={{ fontSize:"0.78rem", color:"var(--text-mute)", marginTop:"1.25rem" }}>
          7-day free Pro trial · Cancel anytime · 30-day money-back guarantee
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"var(--bg)", borderTop:"1px solid var(--border)", padding:"2rem 1.5rem", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:10, marginBottom:"1rem" }}>
          <DigiLearnLogo size={24} />
          <span style={{ fontWeight:800, fontSize:"0.875rem" }}>DigiLearn</span>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:"2rem", flexWrap:"wrap", marginBottom:"1rem" }}>
          {[["Home","/"],["Courses","/#courses"],["Pricing","/pricing"],["Sign in","/auth?mode=login"]].map(([l,h]) => (
            <Link key={l} href={h} style={{ fontSize:"0.8rem", color:"var(--text-mute)", textDecoration:"none" }}>{l}</Link>
          ))}
        </div>
        <p style={{ fontSize:"0.75rem", color:"var(--text-mute)" }}>© 2026 DigiLearn · All rights reserved · SSL secured</p>
      </footer>
    </div>
  );
}
