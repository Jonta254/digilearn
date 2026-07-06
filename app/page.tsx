"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

function DigiLearnLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="url(#dl-bg)"/>
      <circle cx="18" cy="18" r="8" stroke="url(#dl-ring)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="2.5" fill="url(#dl-dot)"/>
      <circle cx="10" cy="22" r="2.5" fill="url(#dl-dot2)"/>
      <circle cx="26" cy="22" r="2.5" fill="url(#dl-dot3)"/>
      <line x1="18" y1="12.5" x2="12" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="18" y1="12.5" x2="24" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="12.5" y1="22" x2="23.5" y2="22" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4"/>
      <defs>
        <linearGradient id="dl-bg" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#061A24"/>
          <stop offset="100%" stopColor="#050508"/>
        </linearGradient>
        <linearGradient id="dl-ring" x1="10" y1="10" x2="26" y2="26">
          <stop offset="0%" stopColor="#00D4FF"/><stop offset="100%" stopColor="#0077AA"/>
        </linearGradient>
        <radialGradient id="dl-dot"><stop offset="0%" stopColor="#00EAFF"/><stop offset="100%" stopColor="#00A8CC"/></radialGradient>
        <radialGradient id="dl-dot2"><stop offset="0%" stopColor="#FF7A00"/><stop offset="100%" stopColor="#CC5500"/></radialGradient>
        <radialGradient id="dl-dot3"><stop offset="0%" stopColor="#A855F7"/><stop offset="100%" stopColor="#7C3AED"/></radialGradient>
      </defs>
    </svg>
  );
}

const COURSES_PREVIEW = [
  { icon:"🤖", title:"ChatGPT & Claude Mastery", level:"Beginner", thumb:"linear-gradient(135deg,#0A0F2E,#1A1060)", tag:"AI Tools",   lessons:38, rating:"4.9", free:true },
  { icon:"⚡", title:"JavaScript: Zero to Pro",  level:"Beginner", thumb:"linear-gradient(135deg,#1A0D00,#CC6200)", tag:"Dev",        lessons:62, rating:"4.8", free:false },
  { icon:"🧠", title:"Prompt Engineering Pro",   level:"Inter",    thumb:"linear-gradient(135deg,#0D001A,#6600CC)", tag:"AI",         lessons:44, rating:"5.0", free:false },
  { icon:"🐍", title:"Python for AI & Data",     level:"Beginner", thumb:"linear-gradient(135deg,#0A1A05,#1A5C0A)", tag:"Data",       lessons:58, rating:"4.9", free:true },
  { icon:"⚛️", title:"React & Next.js 16",       level:"Inter",    thumb:"linear-gradient(135deg,#001520,#006080)", tag:"Dev",        lessons:54, rating:"4.9", free:false },
  { icon:"🔐", title:"Cybersecurity Fundamentals",level:"Beginner", thumb:"linear-gradient(135deg,#150000,#660020)", tag:"Security",  lessons:46, rating:"4.7", free:false },
  { icon:"⚙️", title:"Automation with Make & n8n",level:"Inter",   thumb:"linear-gradient(135deg,#001A0D,#005533)", tag:"Automation", lessons:34, rating:"4.8", free:false },
  { icon:"📊", title:"Data Science with Python",  level:"Inter",   thumb:"linear-gradient(135deg,#0A0505,#3D1A00)", tag:"Data",       lessons:52, rating:"4.8", free:false },
];

const TRACKS = [
  { icon:"🤖", title:"AI Power User", desc:"Master ChatGPT, Claude, Midjourney, Copilot and every AI tool transforming how humans work, create, and think.", courses:12, color:"#00D4FF", bg:"rgba(0,212,255,0.07)", glow:"rgba(0,212,255,0.12)" },
  { icon:"👨‍💻", title:"Become a Developer", desc:"From your first line of HTML to deploying fullstack apps — web, mobile, APIs, and cloud infrastructure.", courses:18, color:"#FF7A00", bg:"rgba(255,122,0,0.07)", glow:"rgba(255,122,0,0.12)" },
  { icon:"🧠", title:"AI & Machine Learning", desc:"Build intelligent systems with Python, PyTorch, and TensorFlow. Train models, deploy them, and understand what they do.", courses:14, color:"#A855F7", bg:"rgba(168,85,247,0.07)", glow:"rgba(168,85,247,0.12)" },
  { icon:"⚙️", title:"Automation & No-Code", desc:"Automate repetitive work, build complex workflows, and ship products without writing a single line of backend code.", courses:9, color:"#22C55E", bg:"rgba(34,197,94,0.07)", glow:"rgba(34,197,94,0.12)" },
  { icon:"📊", title:"Data & Analytics", desc:"Collect, clean, analyze and visualize data. SQL, Pandas, Tableau, and dashboards that help real decisions.", courses:10, color:"#FBBF24", bg:"rgba(251,191,36,0.07)", glow:"rgba(251,191,36,0.12)" },
  { icon:"🔐", title:"Cybersecurity & Privacy", desc:"Understand threats, secure your apps and devices, pass CompTIA Security+, and think like both attacker and defender.", courses:8, color:"#F43F5E", bg:"rgba(244,63,94,0.07)", glow:"rgba(244,63,94,0.12)" },
];

const FEATURES = [
  { icon:"🎯", title:"Project-first learning", desc:"Every course ships a real project. You don't just learn — you build a portfolio that proves you can.", color:"cyan" },
  { icon:"🧠", title:"AI learning assistant", desc:"Ask questions mid-lesson, get personalized feedback, and get unstuck instantly with your built-in AI tutor.", color:"orange" },
  { icon:"📱", title:"Learn anywhere, offline", desc:"Download lessons and continue on a plane, train, or anywhere without internet. No excuses.", color:"violet" },
  { icon:"🏆", title:"Verified certificates", desc:"Complete a learning path and earn a shareable certificate that LinkedIn, employers, and clients respect.", color:"green" },
  { icon:"👥", title:"Peer community", desc:"Join 52,000+ learners. Daily accountability rooms, peer reviews, and mentors who actually answer.", color:"cyan" },
  { icon:"🚀", title:"Career outcomes focus", desc:"Resume reviews, mock interviews, job board access, and a hiring partner network with 200+ companies.", color:"orange" },
];

const TESTIMONIALS = [
  { text:"I went from zero coding knowledge to landing a frontend job in 8 months. The AI path helped me understand tools I now use every single day at work.", name:"Amara Diallo", role:"Frontend Developer, Nairobi", init:"AD", color:"#00D4FF" },
  { text:"The prompt engineering course alone saved me 3 hours per day. I use Claude to draft documents, analyze data, and automate half my workflow.", name:"James Kwame", role:"Operations Manager, Accra", init:"JK", color:"#A855F7" },
  { text:"I'm 47 and completely self-taught from DigiLearn. Built my own business website, set up automations, and now I consult other small businesses.", name:"Fatou Ndiaye", role:"Digital Consultant, Dakar", init:"FN", color:"#FF7A00" },
  { text:"The machine learning path was the most practical ML content I've found anywhere — better than expensive bootcamps. My Python went from beginner to deployed models.", name:"Luca Moretti", role:"ML Engineer, Lagos", init:"LM", color:"#22C55E" },
  { text:"DigiLearn covers the actual tools I use — not theoretical stuff. ChatGPT, Notion AI, Make, n8n. I automated 40% of my agency work within a month.", name:"Sofia Ribeiro", role:"Agency Founder, London", init:"SR", color:"#FBBF24" },
  { text:"The cybersecurity path gave me the confidence to secure my startup's infrastructure. We passed our first security audit. Genuinely life-changing ROI.", name:"Kwabena Asante", role:"CTO at Fintech Startup", init:"KA", color:"#F43F5E" },
];

export default function HomePage() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={revealRef}>
      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <DigiLearnLogo size={32} />
          <span style={{ fontWeight:800, fontSize:"1rem", letterSpacing:"-0.02em" }}>DigiLearn</span>
        </Link>
        <div className="nav-links">
          <Link href="/courses" className="nav-link">Courses</Link>
          <Link href="/#tracks" className="nav-link">Paths</Link>
          <Link href="/#pricing" className="nav-link">Pricing</Link>
          <Link href="/auth" className="nav-link">Sign in</Link>
        </div>
        <Link href="/auth?mode=signup" className="nav-cta">Start free →</Link>
      </nav>

      {/* HERO */}
      <section className="hero aurora-bg">
        <div className="neural-bg" style={{ position:"absolute", inset:0, opacity:0.5 }} />
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          {/* Floating orbs */}
          <div style={{ position:"absolute", top:"15%", left:"8%", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,255,0.12),transparent 70%)", filter:"blur(40px)", animation:"float1 8s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:"20%", right:"10%", width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,122,0,0.10),transparent 70%)", filter:"blur(40px)", animation:"float2 10s ease-in-out infinite" }} />
          <div style={{ position:"absolute", top:"50%", right:"20%", width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(168,85,247,0.10),transparent 70%)", filter:"blur(30px)" }} />
          <style>{`
            @keyframes float1{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
            @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(16px)}}
          `}</style>
        </div>

        <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto" }}>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            52,000+ learners — AI, Dev, Automation, Data &amp; More
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
              { num:"800+", label:"Video lessons" },
              { num:"60+", label:"Real projects" },
              { num:"8",   label:"Learning paths" },
              { num:"94%", label:"Completion rate" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"1.5rem 1.5rem", background:"var(--bg2)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", display:"flex", alignItems:"center", gap:"3rem", flexWrap:"wrap", justifyContent:"center" }}>
          <span style={{ fontSize:"0.7rem", color:"var(--text-mute)", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", flexShrink:0 }}>Graduates work at</span>
          {["Google","Microsoft","Stripe","OpenAI","Notion","Figma","Shopify"].map((c) => (
            <span key={c} style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.8rem", color:"rgba(255,255,255,0.25)", fontWeight:600 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* LEARNING TRACKS */}
      <section className="section reveal" id="tracks">
        <div className="section-tag tag-cyan">Learning Paths</div>
        <h2 className="section-title">Every skill you need<br/>in one place</h2>
        <p className="section-sub">Six structured paths — from AI power user to machine learning engineer. Each one takes you from zero to job-ready with real projects every step of the way.</p>
        <div className="tracks-grid">
          {TRACKS.map((t) => (
            <div key={t.title} className="track-card reveal" style={{ background:`${t.bg}`, borderColor:`${t.color}20` }}>
              <div className="track-glow" style={{ background:`radial-gradient(ellipse 100% 100% at 50% 0%, ${t.glow}, transparent)` }} />
              <div className="track-icon" style={{ background:`${t.color}18`, border:`1px solid ${t.color}30` }}>{t.icon}</div>
              <div className="track-title">{t.title}</div>
              <div className="track-desc">{t.desc}</div>
              <div className="track-count">📚 {t.courses} courses in path</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP COURSES */}
      <section style={{ padding:"5.5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div className="reveal" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:"2.5rem" }}>
            <div>
              <div className="section-tag tag-orange">Most popular</div>
              <h2 className="section-title" style={{ marginBottom:0 }}>Top courses this month</h2>
            </div>
            <Link href="/courses" className="btn-ghost">See all 80+ courses →</Link>
          </div>
          <div className="course-grid">
            {COURSES_PREVIEW.map((c) => (
              <div key={c.title} className="course-card reveal">
                <div className="course-thumb" style={{ background:c.thumb }}>
                  <span style={{ fontSize:"3.5rem", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{c.icon}</span>
                  {c.free && (
                    <span style={{ position:"absolute", top:10, left:10, padding:"2px 9px", borderRadius:6, fontSize:"0.63rem", fontWeight:800, background:"rgba(34,197,94,0.9)", color:"#fff", textTransform:"uppercase" }}>FREE</span>
                  )}
                  <span style={{ position:"absolute", top:10, right:10, padding:"2px 9px", borderRadius:6, fontSize:"0.63rem", fontWeight:700, background:"rgba(0,0,0,0.7)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.15)" }}>{c.tag}</span>
                </div>
                <div className="course-body">
                  <span className={`level-pill ${c.level==="Beginner"?"level-begin":c.level==="Inter"?"level-inter":"level-adv"}`}>{c.level==="Inter"?"Intermediate":c.level}</span>
                  <div className="course-title">{c.title}</div>
                  <div style={{ color:"var(--amber)", fontSize:"0.8rem", marginBottom:"0.5rem" }}>
                    {"★".repeat(5)} <span style={{ color:"var(--text-mute)" }}>({c.rating})</span>
                  </div>
                  <div className="course-meta">
                    <span className="course-meta-item">📚 {c.lessons} lessons</span>
                    <span className="course-meta-item" style={{ marginLeft:"auto", color:c.free?"var(--green)":"var(--text-dim)", fontWeight:c.free?700:400 }}>
                      {c.free ? "Free" : "Pro"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DIGILEARN */}
      <section className="section reveal">
        <div className="section-tag tag-violet">Why DigiLearn</div>
        <h2 className="section-title">Built different.<br/>Built for results.</h2>
        <p className="section-sub">Other platforms teach syntax. We teach you how to build, ship, and leverage AI to multiply your output — skills that turn into income.</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className={`feature-card fc-${f.color} reveal`}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI TOOLS SECTION */}
      <section style={{ padding:"5.5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div className="reveal" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,460px),1fr))", gap:"4rem", alignItems:"center" }}>
            <div>
              <div className="section-tag tag-cyan">AI Tools Mastery</div>
              <h2 className="section-title">Learn every AI tool<br/>that matters</h2>
              <p style={{ color:"var(--text-dim)", lineHeight:1.85, marginBottom:"2rem", fontSize:"0.975rem" }}>
                The AI revolution is moving fast. DigiLearn covers every major tool — not just introductions, but real mastery. Learn to use AI to write, code, design, analyze data, automate workflows, and solve problems 10× faster than before.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2rem" }}>
                {[
                  { tool:"ChatGPT & GPT-4o", desc:"Advanced prompting, custom GPTs, API integration" },
                  { tool:"Claude (Anthropic)", desc:"Long-context tasks, coding assistant, analysis workflows" },
                  { tool:"Midjourney & DALL·E 3", desc:"AI image generation, prompt craft, creative production" },
                  { tool:"GitHub Copilot", desc:"AI pair programming, code review, documentation generation" },
                  { tool:"Perplexity & Gemini", desc:"AI research workflows, search strategies, fact-checking" },
                  { tool:"Make & n8n Automation", desc:"No-code workflow automation, AI-powered pipelines" },
                ].map((item) => (
                  <div key={item.tool} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"0.875rem 1.25rem", background:"var(--surface)", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)" }}>
                    <span style={{ color:"var(--cyan)", fontSize:"0.9rem", marginTop:2, flexShrink:0 }}>◆</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"0.875rem", marginBottom:2 }}>{item.tool}</div>
                      <div style={{ fontSize:"0.8rem", color:"var(--text-mute)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/courses" className="btn-primary">Explore AI courses →</Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <div style={{ background:"var(--surface)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:"var(--radius)", padding:"1.75rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,var(--cyan),transparent)" }} />
                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.7rem", color:"var(--text-mute)", marginBottom:"1rem", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#22C55E" }} />
                  Claude · Prompt Engineering
                </div>
                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.8rem", lineHeight:1.85 }}>
                  <div style={{ color:"#5A6490" }}>&gt; User prompt:</div>
                  <div style={{ color:"#E0E6FF", marginLeft:12 }}>&ldquo;Analyze this sales data and<br/>identify the top 3 trends&rdquo;</div>
                  <div style={{ color:"#5A6490", marginTop:8 }}>&gt; Optimized prompt:</div>
                  <div style={{ color:"var(--cyan)", marginLeft:12 }}>&ldquo;Act as a senior data analyst.<br/>Review the attached CSV. Return<br/>exactly 3 trends ranked by business<br/>impact. Format as a table.&rdquo;</div>
                  <div style={{ color:"var(--green)", marginTop:8 }}>✓ 4× more actionable output</div>
                </div>
              </div>
              <div style={{ background:"var(--surface)", border:"1px solid rgba(168,85,247,0.2)", borderRadius:"var(--radius)", padding:"1.5rem" }}>
                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.7rem", color:"var(--violet)", marginBottom:"0.75rem" }}>AUTOMATION WORKFLOW</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {["📥 Email arrives with invoice","🤖 AI extracts line items","📊 Updates spreadsheet","💬 Slack notification sent","✅ Approval requested"].map((step, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:"0.8rem" }}>
                      <span style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.65rem", color:"var(--text-mute)", width:16, flexShrink:0 }}>0{i+1}</span>
                      <span style={{ color:"var(--text-dim)" }}>{step}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:"1rem", fontSize:"0.75rem", color:"var(--text-mute)", fontFamily:"'Fira Code',monospace" }}>→ Make · n8n · Zapier covered in full</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section reveal">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-tag tag-cyan" style={{ margin:"0 auto 1rem" }}>What learners say</div>
          <h2 className="section-title">Real people, real outcomes</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card reveal">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-quote">&ldquo;{t.text}&rdquo;</div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background:`linear-gradient(135deg,${t.color},${t.color}88)` }}>{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section reveal" id="pricing">
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <div className="section-tag tag-orange" style={{ margin:"0 auto 1rem" }}>Pricing</div>
          <h2 className="section-title">Invest in yourself</h2>
          <p className="section-sub" style={{ margin:"0 auto" }}>One subscription. Every course, every path, every project. Cancel any time — no questions asked.</p>
        </div>
        <div className="price-grid" style={{ maxWidth:900, margin:"0 auto" }}>
          {[
            { tier:"Free", amount:"$0", desc:"Start learning immediately with no credit card required.", cta:"Start free", featured:false, list:["10 free starter courses","AI tools intro module","Community access","Basic certificates"] },
            { tier:"Pro", amount:"$16", desc:"Everything you need to go from curious to career-ready.", cta:"Start 7-day trial", featured:true, list:["80+ courses unlocked","All 6 learning paths","AI learning assistant","Project feedback","Verified certificates","Career portal & job board","Offline downloads","Priority community support"] },
            { tier:"Team", amount:"$12", desc:"For companies upskilling their people in AI and tech.", cta:"Contact sales", featured:false, list:["Everything in Pro","Team dashboard & analytics","Manager progress reports","Custom learning paths","Onboarding support","Volume pricing available"] },
          ].map((p) => (
            <div key={p.tier} className={`price-card ${p.featured?"featured":""}`}>
              <div className="price-tier">{p.tier}</div>
              <div className="price-amount">{p.amount}{p.amount!=="$0"&&<small> /mo</small>}</div>
              <div className="price-desc">{p.desc}</div>
              <ul className="price-list">
                {p.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href="/auth?mode=signup" className={p.featured?"btn-primary":"btn-secondary"} style={{ display:"block", textAlign:"center", width:"100%" }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div style={{ borderTop:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"5rem 1.5rem", textAlign:"center" }}>
          <h2 className="reveal" style={{ fontSize:"clamp(2rem,5vw,4rem)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:"1.25rem", lineHeight:1 }}>
            The future belongs to people<br/>who keep <span className="cyan-text">learning</span>
          </h2>
          <p className="reveal" style={{ color:"var(--text-dim)", fontSize:"1.05rem", marginBottom:"2.5rem", maxWidth:480, margin:"0 auto 2.5rem" }}>
            52,000 people are already learning on DigiLearn. Don&apos;t let the AI revolution pass you by.
          </p>
          <Link href="/auth?mode=signup" className="btn-primary reveal" style={{ fontSize:"1.05rem", padding:"1rem 2.75rem" }}>
            Create free account →
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:"1px solid var(--border)" }}>
        <footer className="footer">
          <div className="footer-top">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"0.75rem" }}>
                <DigiLearnLogo size={28} />
                <span style={{ fontWeight:800, fontSize:"0.95rem" }}>DigiLearn</span>
              </div>
              <div className="footer-desc">The complete digital learning platform for the AI era. Code, AI tools, automation, data science, and every skill that matters.</div>
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
              <a href="https://josiah-rawsignal.vercel.app" target="_blank" rel="noopener" className="portfolio-link">← By Brian Josiah</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 DigiLearn. All rights reserved.</div>
            <div style={{ display:"flex", gap:"1.5rem" }}>
              {["Privacy","Terms","Cookies"].map((l) => <a key={l} href="#" className="footer-link" style={{ marginBottom:0 }}>{l}</a>)}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
