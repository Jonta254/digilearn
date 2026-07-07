"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function DigiLearnLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="url(#dl-bg)"/>
      {/* Outer ring */}
      <circle cx="20" cy="20" r="12" stroke="url(#dl-ring)" strokeWidth="1" fill="none" strokeDasharray="4 2"/>
      {/* Nodes */}
      <circle cx="20" cy="9"  r="3.5" fill="url(#dl-n1)"/>
      <circle cx="9"  cy="27" r="3.5" fill="url(#dl-n2)"/>
      <circle cx="31" cy="27" r="3.5" fill="url(#dl-n3)"/>
      {/* Center node */}
      <circle cx="20" cy="20" r="2.5" fill="white" fillOpacity="0.9"/>
      {/* Connections */}
      <line x1="20" y1="12.5" x2="11"  y2="25" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="20" y1="12.5" x2="29"  y2="25" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="12.5" y1="27" x2="27.5" y2="27" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="20" y1="12.5" x2="20" y2="17.5" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
      <line x1="11" y1="25"  x2="17.5" y2="20" stroke="white" strokeWidth="1" strokeOpacity="0.25"/>
      <line x1="29" y1="25"  x2="22.5" y2="20" stroke="white" strokeWidth="1" strokeOpacity="0.25"/>
      <defs>
        <linearGradient id="dl-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#0284C7"/>
          <stop offset="100%" stopColor="#0369A1"/>
        </linearGradient>
        <linearGradient id="dl-ring" x1="8" y1="8" x2="32" y2="32">
          <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
        </linearGradient>
        <radialGradient id="dl-n1"><stop offset="0%" stopColor="#7DD3FC"/><stop offset="100%" stopColor="#38BDF8"/></radialGradient>
        <radialGradient id="dl-n2"><stop offset="0%" stopColor="#FED7AA"/><stop offset="100%" stopColor="#FB923C"/></radialGradient>
        <radialGradient id="dl-n3"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#A78BFA"/></radialGradient>
      </defs>
    </svg>
  );
}

const COURSES_PREVIEW = [
  { icon:"🤖", title:"ChatGPT & Claude Mastery",  level:"Beginner", thumb:"linear-gradient(135deg,#0C4A6E,#0369A1)", tag:"AI Tools",   lessons:38, rating:"4.9", free:true },
  { icon:"⚡", title:"JavaScript: Zero to Pro",    level:"Beginner", thumb:"linear-gradient(135deg,#7C2D12,#EA580C)", tag:"Dev",        lessons:62, rating:"4.8", free:false },
  { icon:"🧠", title:"Prompt Engineering Pro",     level:"Inter",    thumb:"linear-gradient(135deg,#4C1D95,#7C3AED)", tag:"AI",         lessons:44, rating:"5.0", free:false },
  { icon:"🐍", title:"Python for AI & Data",       level:"Beginner", thumb:"linear-gradient(135deg,#14532D,#16A34A)", tag:"Data",       lessons:58, rating:"4.9", free:true },
  { icon:"⚛️", title:"React & Next.js 16",         level:"Inter",    thumb:"linear-gradient(135deg,#164E63,#0891B2)", tag:"Dev",        lessons:54, rating:"4.9", free:false },
  { icon:"🔐", title:"Cybersecurity Fundamentals", level:"Beginner", thumb:"linear-gradient(135deg,#881337,#E11D48)", tag:"Security",   lessons:46, rating:"4.7", free:false },
  { icon:"⚙️", title:"Automation with Make & n8n", level:"Inter",    thumb:"linear-gradient(135deg,#064E3B,#059669)", tag:"Automation", lessons:34, rating:"4.8", free:false },
  { icon:"📊", title:"Data Science with Python",   level:"Inter",    thumb:"linear-gradient(135deg,#431407,#B45309)", tag:"Data",       lessons:52, rating:"4.8", free:false },
];

const TRACKS = [
  { icon:"🤖", title:"AI Power User",         desc:"Master ChatGPT, Claude, Midjourney, and every AI tool transforming how humans work.", courses:12, color:"#0284C7", bg:"#EFF6FF", border:"#BFDBFE" },
  { icon:"👨‍💻", title:"Become a Developer",    desc:"HTML to deployed fullstack apps — web, mobile, APIs, and cloud. From first line to first job.", courses:18, color:"#EA580C", bg:"#FFF7ED", border:"#FED7AA" },
  { icon:"🧠", title:"AI & Machine Learning",  desc:"Build intelligent systems with Python, PyTorch, TensorFlow. Train, deploy, and ship real models.", courses:14, color:"#7C3AED", bg:"#F5F3FF", border:"#DDD6FE" },
  { icon:"🗄️", title:"Databases & Data Eng",  desc:"SQL, PostgreSQL, MongoDB, Redis, BigQuery and vector databases — the foundation of every data-driven product.", courses:7, color:"#0891B2", bg:"#ECFEFF", border:"#A5F3FC" },
  { icon:"⚖️", title:"AI Ethics & Policy",     desc:"Understand bias, fairness, AI regulation, and how to build technology that respects human rights.", courses:6,  color:"#D97706", bg:"#FFFBEB", border:"#FDE68A" },
  { icon:"💹", title:"Finance & Fintech",      desc:"Algo trading, financial modelling, blockchain, and Python for quant analysis. Tech meets capital markets.", courses:6, color:"#16A34A", bg:"#F0FDF4", border:"#BBF7D0" },
  { icon:"🏥", title:"Healthcare & Health IT", desc:"AI diagnostics, EHR systems, biomedical data analysis, and the digital future of medicine.", courses:5,  color:"#7C3AED", bg:"#F5F3FF", border:"#DDD6FE" },
  { icon:"🏛️", title:"Policy & Civic Tech",   desc:"Open data, AI governance, data journalism, and civic technology that drives real public impact.", courses:6,  color:"#0284C7", bg:"#EFF6FF", border:"#BFDBFE" },
  { icon:"⚙️", title:"Automation & No-Code",   desc:"Automate repetitive work, build complex workflows, ship products without writing backend code.", courses:9,  color:"#16A34A", bg:"#F0FDF4", border:"#BBF7D0" },
  { icon:"🔐", title:"Cybersecurity",          desc:"Understand threats, secure apps and devices, pass CompTIA Security+, think like an attacker.", courses:8,  color:"#E11D48", bg:"#FFF1F2", border:"#FECDD3" },
];

const FEATURES = [
  { icon:"🎯", title:"Project-first learning",    desc:"Every course ships a real project. You don't just learn — you build a portfolio that proves you can deliver.", color:"cyan" },
  { icon:"🧠", title:"AI learning assistant",     desc:"Ask questions mid-lesson, get personalized feedback, and get unstuck instantly with your built-in tutor.", color:"orange" },
  { icon:"📱", title:"Learn anywhere, offline",   desc:"Download lessons and continue on a plane, train, or anywhere without internet.", color:"violet" },
  { icon:"🏆", title:"Verified certificates",     desc:"Complete a path and earn a shareable certificate that LinkedIn, employers, and clients recognize.", color:"green" },
  { icon:"👥", title:"Peer community",            desc:"Join 52,000+ learners. Daily accountability rooms, peer reviews, and mentors who actually answer.", color:"cyan" },
  { icon:"🚀", title:"Career outcomes focus",     desc:"Resume reviews, mock interviews, job board access, and a hiring partner network with 200+ companies.", color:"orange" },
];

const TESTIMONIALS = [
  { text:"I went from zero coding knowledge to landing a frontend job in 8 months. The AI path helped me understand tools I now use every single day.", name:"Amara Diallo", role:"Frontend Developer, Nairobi", init:"AD", color:"#0284C7" },
  { text:"The prompt engineering course alone saved me 3 hours per day. I use Claude to draft documents, analyze data, and automate half my workflow.", name:"James Kwame", role:"Operations Manager, Accra", init:"JK", color:"#7C3AED" },
  { text:"I'm 47 and completely self-taught from DigiLearn. Built my own business website, set up automations, and now consult other small businesses.", name:"Fatou Ndiaye", role:"Digital Consultant, Dakar", init:"FN", color:"#EA580C" },
  { text:"The ML path was the most practical ML content I've found anywhere — better than expensive bootcamps. Python went from beginner to deployed models.", name:"Luca Moretti", role:"ML Engineer, Lagos", init:"LM", color:"#16A34A" },
  { text:"DigiLearn covers tools I actually use — ChatGPT, Notion AI, Make, n8n. I automated 40% of my agency work within a month of starting.", name:"Sofia Ribeiro", role:"Agency Founder, London", init:"SR", color:"#D97706" },
  { text:"The cybersecurity path gave me the confidence to secure my startup's infrastructure. We passed our first security audit. Game-changing ROI.", name:"Kwabena Asante", role:"CTO at Fintech Startup", init:"KA", color:"#E11D48" },
];

const COMPANIES = ["Google","Microsoft","Stripe","OpenAI","Notion","Figma","Shopify"];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <DigiLearnLogo size={32} />
          <span style={{ fontWeight:800, fontSize:"1rem", letterSpacing:"-0.02em", color:"var(--text)" }}>DigiLearn</span>
        </Link>
        <div className="nav-links">
          <Link href="/courses" className="nav-link">Courses</Link>
          <Link href="/#tracks" className="nav-link">Paths</Link>
          <Link href="/#pricing" className="nav-link">Pricing</Link>
          <Link href="/auth" className="nav-link">Sign in</Link>
        </div>
        <Link href="/auth?mode=signup" className="nav-cta" style={{ display:"flex", alignItems:"center" }}>Start free →</Link>
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {[["Courses","/courses"],["Learning Paths","/#tracks"],["Pricing","/#pricing"],["Sign in","/auth"]].map(([l,h]) => (
          <Link key={l} href={h} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{l}</Link>
        ))}
        <Link href="/auth?mode=signup" className="btn-primary" style={{ marginTop:"0.5rem", justifyContent:"center" }} onClick={() => setMenuOpen(false)}>Start free →</Link>
      </div>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero aurora-bg">
        <div className="neural-bg" style={{ position:"absolute", inset:0, opacity:0.35 }} />
        <div aria-hidden style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"10%", left:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(2,132,199,0.12),transparent 70%)", filter:"blur(60px)", animation:"float1 8s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:"15%", right:"8%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle,rgba(234,88,12,0.09),transparent 70%)", filter:"blur(60px)", animation:"float2 10s ease-in-out infinite" }} />
          <style>{`
            @keyframes float1{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.04)}}
            @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}
          `}</style>
        </div>

        <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto", width:"100%", padding:"0 0.5rem" }}>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            52,000+ learners · AI, Dev, Automation, Data &amp; More
          </div>

          <h1 className="hero-title">
            Master the skills<br/>
            <span className="cyan-text">that define</span><br/>
            <span className="orange-text">the future</span>
          </h1>

          <p className="hero-sub">
            Code, AI tools, machine learning, automation, cybersecurity — the complete digital curriculum for humans who want to stay relevant, build things that matter, and lead in an AI-first world.
          </p>

          <div className="hero-actions">
            <Link href="/auth?mode=signup" className="btn-primary" style={{ fontSize:"1rem" }}>
              Start learning free →
            </Link>
            <Link href="/courses" className="btn-secondary">
              Browse 80+ courses
            </Link>
          </div>

          <div className="hero-stats reveal">
            {[
              { num:"52K+", label:"Active learners" },
              { num:"800+", label:"Lessons" },
              { num:"60+",  label:"Projects" },
              { num:"8",    label:"Paths" },
              { num:"94%",  label:"Completion" },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────── */}
      <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"1.5rem", background:"var(--bg2)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", display:"flex", alignItems:"center", gap:"clamp(1.5rem,4vw,2.5rem)", flexWrap:"wrap", justifyContent:"center" }}>
          <span style={{ fontSize:"0.68rem", color:"var(--text-mute)", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", flexShrink:0 }}>Graduates work at</span>
          {COMPANIES.map((c) => (
            <span key={c} style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.85rem", color:"var(--text-mute)", fontWeight:600, letterSpacing:"0.04em" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── LEARNING TRACKS ────────────────────────────────── */}
      <section className="section" id="tracks">
        <div className="reveal">
          <div className="section-tag tag-cyan">Learning Paths</div>
          <h2 className="section-title">Every skill you need<br/>in one place</h2>
          <p className="section-sub">Six structured paths — from AI power user to machine learning engineer. Each takes you from zero to job-ready with real projects.</p>
        </div>
        <div className="tracks-grid">
          {TRACKS.map((t, i) => (
            <div key={t.title} className="track-card reveal" style={{ background:t.bg, borderColor:t.border, transitionDelay:`${i*0.06}s` }}>
              <div className="track-icon" style={{ background:"white", border:`1px solid ${t.border}`, boxShadow:`0 2px 8px ${t.color}22` }}>{t.icon}</div>
              <div className="track-title">{t.title}</div>
              <div className="track-desc">{t.desc}</div>
              <div className="track-count" style={{ color:t.color }}>📚 {t.courses} courses in path</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP COURSES ────────────────────────────────────── */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div className="reveal" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:"2.5rem" }}>
            <div>
              <div className="section-tag tag-orange">Most popular</div>
              <h2 className="section-title" style={{ marginBottom:0 }}>Top courses this month</h2>
            </div>
            <Link href="/courses" className="btn-ghost">See all 80+ courses →</Link>
          </div>
          <div className="course-grid">
            {COURSES_PREVIEW.map((c, i) => (
              <Link href="/courses" key={c.title} className="course-card reveal" style={{ textDecoration:"none", color:"inherit", transitionDelay:`${i*0.05}s` }}>
                <div className="course-thumb" style={{ background:c.thumb }}>
                  <span style={{ fontSize:"3rem", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{c.icon}</span>
                  {c.free && (
                    <span style={{ position:"absolute", top:10, left:10, padding:"2px 9px", borderRadius:6, fontSize:"0.62rem", fontWeight:800, background:"rgba(22,163,74,0.9)", color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em" }}>FREE</span>
                  )}
                  <span style={{ position:"absolute", top:10, right:10, padding:"2px 9px", borderRadius:6, fontSize:"0.62rem", fontWeight:700, background:"rgba(0,0,0,0.65)", color:"rgba(255,255,255,0.85)" }}>{c.tag}</span>
                </div>
                <div className="course-body">
                  <span className={`level-pill ${c.level==="Beginner"?"level-begin":c.level==="Inter"?"level-inter":"level-adv"}`}>{c.level==="Inter"?"Intermediate":c.level}</span>
                  <div className="course-title">{c.title}</div>
                  <div style={{ color:"#D97706", fontSize:"0.8rem", marginBottom:"0.5rem" }}>
                    {"★".repeat(5)} <span style={{ color:"var(--text-mute)", fontWeight:400 }}>{c.rating}</span>
                  </div>
                  <div className="course-meta">
                    <span className="course-meta-item">📚 {c.lessons} lessons</span>
                    <span style={{ marginLeft:"auto", fontSize:"0.75rem", fontWeight:700, color:c.free?"var(--green)":"var(--text-dim)" }}>
                      {c.free ? "Free" : "Pro"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DIGILEARN ──────────────────────────────────── */}
      <section className="section">
        <div className="reveal">
          <div className="section-tag tag-violet">Why DigiLearn</div>
          <h2 className="section-title">Built different.<br/>Built for results.</h2>
          <p className="section-sub">Other platforms teach syntax. We teach you how to build, ship, and leverage AI to multiply your output.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`feature-card fc-${f.color} reveal`} style={{ transitionDelay:`${i*0.06}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI TOOLS ───────────────────────────────────────── */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div className="reveal" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,440px),1fr))", gap:"3.5rem", alignItems:"center" }}>
            <div>
              <div className="section-tag tag-cyan">AI Tools Mastery</div>
              <h2 className="section-title">Learn every AI tool<br/>that matters</h2>
              <p style={{ color:"var(--text-dim)", lineHeight:1.85, marginBottom:"2rem", fontSize:"0.975rem" }}>
                The AI revolution is fast. DigiLearn covers every major tool — not introductions but real mastery. Write, code, design, analyze data, and automate workflows 10× faster.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"2rem" }}>
                {[
                  { tool:"ChatGPT & GPT-4o",  desc:"Advanced prompting, custom GPTs, API integration" },
                  { tool:"Claude",            desc:"Long-context tasks, coding assistant, analysis workflows" },
                  { tool:"Midjourney & DALL·E 3", desc:"AI image generation, prompt craft, creative production" },
                  { tool:"GitHub Copilot",    desc:"AI pair programming, code review, documentation generation" },
                  { tool:"Perplexity & Gemini",desc:"AI research workflows, search strategies, fact-checking" },
                  { tool:"Make & n8n",        desc:"No-code workflow automation, AI-powered pipelines" },
                ].map((item) => (
                  <div key={item.tool} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"0.75rem 1rem", background:"var(--surface)", borderRadius:"var(--radius-sm)", border:"1.5px solid var(--border)", boxShadow:"var(--shadow-xs)" }}>
                    <span style={{ color:"var(--cyan)", fontSize:"0.85rem", marginTop:3, flexShrink:0, fontWeight:800 }}>◆</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"0.875rem", marginBottom:2, color:"var(--text)" }}>{item.tool}</div>
                      <div style={{ fontSize:"0.78rem", color:"var(--text-mute)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/courses" className="btn-primary">Explore AI courses →</Link>
            </div>
            {/* Code editor cards stay dark — that's correct for code displays */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <div style={{ background:"#0F1629", border:"1px solid rgba(59,130,246,0.2)", borderRadius:"var(--radius)", padding:"1.75rem", boxShadow:"var(--shadow-sm)" }}>
                <div style={{ fontSize:"0.68rem", color:"#64748B", marginBottom:"1rem", display:"flex", alignItems:"center", gap:8, fontFamily:"'Fira Code',monospace", letterSpacing:"0.05em" }}>
                  <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#22C55E" }} />
                  Claude · Prompt Engineering
                </div>
                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.8rem", lineHeight:1.85 }}>
                  <div style={{ color:"#475569" }}>&gt; Basic prompt:</div>
                  <div style={{ color:"#94A3B8", marginLeft:12 }}>&ldquo;Analyze this sales data&rdquo;</div>
                  <div style={{ color:"#475569", marginTop:8 }}>&gt; Optimized prompt:</div>
                  <div style={{ color:"#7DD3FC", marginLeft:12 }}>&ldquo;Act as a senior data analyst. Review the CSV. Return 3 trends ranked by business impact as a table.&rdquo;</div>
                  <div style={{ color:"#4ADE80", marginTop:8, fontWeight:600 }}>✓ 4× more actionable output</div>
                </div>
              </div>
              <div style={{ background:"#0D0D1A", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"var(--radius)", padding:"1.5rem", boxShadow:"var(--shadow-sm)" }}>
                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.68rem", color:"#A78BFA", marginBottom:"0.875rem", letterSpacing:"0.08em" }}>AUTOMATION WORKFLOW · MAKE</div>
                {["📥 Email arrives with invoice","🤖 AI extracts line items","📊 Updates Google Sheet","💬 Slack notification sent","✅ Manager approval requested"].map((step, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:"0.8rem", marginBottom:8 }}>
                    <span style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.65rem", color:"#4B5563", width:18, flexShrink:0 }}>0{i+1}</span>
                    <span style={{ color:"#9CA3AF" }}>{step}</span>
                  </div>
                ))}
                <div style={{ marginTop:"0.75rem", fontSize:"0.72rem", color:"#4B5563", fontFamily:"'Fira Code',monospace" }}>→ Make · n8n · Zapier covered in full</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section className="section">
        <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-tag tag-cyan" style={{ margin:"0 auto 1rem" }}>What learners say</div>
          <h2 className="section-title">Real people, real outcomes</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="testi-card reveal" style={{ transitionDelay:`${i*0.07}s` }}>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-quote">&ldquo;{t.text}&rdquo;</div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background:`linear-gradient(135deg,${t.color},${t.color}cc)` }}>{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border)" }} id="pricing">
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div className="reveal" style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div className="section-tag tag-orange" style={{ margin:"0 auto 1rem" }}>Pricing</div>
            <h2 className="section-title">Invest in yourself</h2>
            <p className="section-sub" style={{ margin:"0 auto", textAlign:"center" }}>One subscription. Every course, every path, every project. Cancel any time.</p>
          </div>
          <div className="price-grid">
            {[
              { tier:"Free", amount:"$0", desc:"Start learning with no credit card required.", cta:"Start free →", featured:false, list:["10 free starter courses","AI tools intro module","Community access","Basic certificates","Mobile app access"] },
              { tier:"Pro", amount:"$16", desc:"Everything you need to go from curious to career-ready.", cta:"Start 7-day trial →", featured:true, list:["80+ courses unlocked","All 6 learning paths","AI learning assistant","Project feedback & review","Verified certificates","Career portal & job board","Offline downloads","Priority community support"] },
              { tier:"Team", amount:"$12", desc:"For companies upskilling their people in AI and tech.", cta:"Contact sales →", featured:false, list:["Everything in Pro","Team dashboard & analytics","Manager progress reports","Custom learning paths","Onboarding support","Volume pricing available"] },
            ].map((p) => (
              <div key={p.tier} className={`price-card ${p.featured?"featured":""}`}>
                <div className="price-tier">{p.tier}</div>
                <div className="price-amount">{p.amount}{p.amount!=="$0"&&<small> /mo</small>}</div>
                <div className="price-desc">{p.desc}</div>
                <ul className="price-list">
                  {p.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <Link href="/auth?mode=signup" className={p.featured?"btn-primary":"btn-secondary"} style={{ display:"flex", textAlign:"center", width:"100%", justifyContent:"center" }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section style={{ padding:"5rem 1.5rem", background:"linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)", borderTop:"1px solid var(--border)" }}>
        <div style={{ maxWidth:640, margin:"0 auto", textAlign:"center" }}>
          <h2 className="reveal" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:"1.25rem", lineHeight:1.05, color:"var(--text)" }}>
            The future belongs to people<br/>who keep <span className="cyan-text">learning</span>
          </h2>
          <p className="reveal" style={{ color:"var(--text-dim)", fontSize:"1.05rem", marginBottom:"2.5rem", lineHeight:1.8 }}>
            52,000 people are already learning on DigiLearn. Don&apos;t let the AI revolution pass you by.
          </p>
          <div className="reveal" style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/auth?mode=signup" className="btn-primary" style={{ fontSize:"1rem" }}>Create free account →</Link>
            <Link href="/courses" className="btn-ghost">Browse courses</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <div style={{ borderTop:"1px solid var(--border)", background:"var(--bg)" }}>
        <footer className="footer">
          <div className="footer-top">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"0.875rem" }}>
                <DigiLearnLogo size={30} />
                <span style={{ fontWeight:800, fontSize:"0.95rem", color:"var(--text)" }}>DigiLearn</span>
              </div>
              <div className="footer-desc">The complete digital learning platform for the AI era. Code, AI tools, automation, data science — every skill that matters in 2026.</div>
            </div>
            <div>
              <div className="footer-col-h">Learn</div>
              {["AI Tools Mastery","Web Development","Python & Data","Automation","Cybersecurity","Entrepreneurship"].map((l) => <Link key={l} href="/courses" className="footer-link">{l}</Link>)}
            </div>
            <div>
              <div className="footer-col-h">Platform</div>
              {["Courses","Learning Paths","Dashboard","Certificates","Community","Careers"].map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
            </div>
            <div>
              <div className="footer-col-h">Company</div>
              {["About","Blog","Pricing","For Teams","Affiliates"].map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
              <div className="footer-col-h" style={{ marginTop:"1.5rem" }}>Portfolio</div>
              <a href="https://josiah-rawsignal.vercel.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">← Brian Josiah</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 DigiLearn · All rights reserved</div>
            <div style={{ display:"flex", gap:"1.5rem" }}>
              {["Privacy","Terms","Cookies"].map((l) => <a key={l} href="#" className="footer-link" style={{ marginBottom:0 }}>{l}</a>)}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
