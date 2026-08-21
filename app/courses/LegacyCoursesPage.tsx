"use client";
import { useState } from "react";
import Link from "next/link";
import { COURSES } from "./courses";

const ALL_COURSES = COURSES;

const TOPICS = [
  { id:"all",        label:"All Courses",     count:ALL_COURSES.length },
  { id:"ai-tools",   label:"AI Tools",        count:ALL_COURSES.filter(c=>c.topic==="ai-tools").length },
  { id:"webdev",     label:"Web Dev",         count:ALL_COURSES.filter(c=>c.topic==="webdev").length },
  { id:"data",       label:"Data Science",    count:ALL_COURSES.filter(c=>c.topic==="data").length },
  { id:"databases",  label:"Databases",       count:ALL_COURSES.filter(c=>c.topic==="databases").length },
  { id:"automation", label:"Automation",      count:ALL_COURSES.filter(c=>c.topic==="automation").length },
  { id:"security",   label:"Cybersecurity",   count:ALL_COURSES.filter(c=>c.topic==="security").length },
  { id:"ethics",     label:"AI Ethics",       count:ALL_COURSES.filter(c=>c.topic==="ethics").length },
  { id:"finance",    label:"Finance & Tech",  count:ALL_COURSES.filter(c=>c.topic==="finance").length },
  { id:"healthcare", label:"Healthcare",      count:ALL_COURSES.filter(c=>c.topic==="healthcare").length },
  { id:"policy",     label:"Policy & Civic",  count:ALL_COURSES.filter(c=>c.topic==="policy").length },
  { id:"business",   label:"Business",        count:ALL_COURSES.filter(c=>c.topic==="business").length },
];
const LEVELS = ["All","Beginner","Intermediate","Advanced"];

function DigiLearnLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="url(#dl-c-bg)"/>
      <circle cx="18" cy="18" r="8" stroke="url(#dl-c-ring)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="2.5" fill="#00D4FF"/><circle cx="10" cy="22" r="2.5" fill="#FF7A00"/><circle cx="26" cy="22" r="2.5" fill="#A855F7"/>
      <line x1="18" y1="12.5" x2="12" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="18" y1="12.5" x2="24" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="12.5" y1="22" x2="23.5" y2="22" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4"/>
      <defs>
        <linearGradient id="dl-c-bg" x1="0" y1="0" x2="36" y2="36"><stop offset="0%" stopColor="#061A24"/><stop offset="100%" stopColor="#050508"/></linearGradient>
        <linearGradient id="dl-c-ring" x1="10" y1="10" x2="26" y2="26"><stop offset="0%" stopColor="#00D4FF"/><stop offset="100%" stopColor="#0077AA"/></linearGradient>
      </defs>
    </svg>
  );
}

export default function CoursesPage() {
  const [topic, setTopic]   = useState("all");
  const [level, setLevel]   = useState("All");
  const [search, setSearch] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = ALL_COURSES.filter((c) => {
    if (topic !== "all" && c.topic !== topic) return false;
    if (level !== "All" && c.level !== level) return false;
    if (freeOnly && !c.free) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)) || c.topic.includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight:"100svh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <DigiLearnLogo size={28} />
          <span style={{ fontWeight:800 }}>DigiLearn</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/courses" className="nav-link active">Courses</Link>
          <Link href="/practice" className="nav-link">Practice</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </div>
        <Link href="/auth?mode=signup" className="nav-cta">Start free →</Link>
      </nav>

      {/* Header */}
      <div style={{ paddingTop:"5rem", background:"linear-gradient(180deg,rgba(0,212,255,0.06) 0%,transparent 100%)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"3rem 1.5rem" }}>
          <div className="section-tag tag-cyan" style={{ marginBottom:"1rem" }}>{ALL_COURSES.length} courses · free to browse</div>
          <h1 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:"1rem" }}>
            Every course you need to<br/><span className="cyan-text">thrive in the AI era</span>
          </h1>
          <p style={{ color:"var(--text-dim)", fontSize:"1rem", marginBottom:"2.25rem", maxWidth:560, lineHeight:1.8 }}>
            AI tools, web development, data science, automation, cybersecurity, and digital business — structured learning that translates directly into real skills and real income.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", maxWidth:600 }}>
            <div style={{ flex:1, position:"relative", minWidth:220 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--text-mute)", pointerEvents:"none" }}>🔍</span>
              <input value={search} onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search by topic, tool, or skill..."
                style={{ width:"100%", padding:"0.75rem 1rem 0.75rem 2.5rem", borderRadius:9, background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--text)", fontSize:"0.9rem", outline:"none", fontFamily:"inherit" }}
              />
            </div>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:"0.875rem", color:"var(--text-dim)", padding:"0.75rem 1rem", background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:9 }}>
              <input type="checkbox" checked={freeOnly} onChange={(e)=>setFreeOnly(e.target.checked)} style={{ accentColor:"var(--cyan)" }} />
              Free only
            </label>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:"0 auto", padding:"2rem 1.5rem" }}>
        {/* Topic tabs */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1rem" }}>
          {TOPICS.map((t) => (
            <button key={t.id} onClick={()=>setTopic(t.id)} style={{
              padding:"0.45rem 1.1rem", borderRadius:100, fontSize:"0.8rem", fontWeight:600,
              cursor:"pointer", border:"1px solid", transition:"all 0.15s",
              background: topic===t.id ? "linear-gradient(135deg,var(--cyan),#0099CC)" : "transparent",
              borderColor: topic===t.id ? "transparent" : "var(--border2)",
              color: topic===t.id ? "#fff" : "var(--text-dim)",
            }}>
              {t.label} <span style={{ opacity:0.6, fontSize:"0.7rem" }}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* Level pills */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1.75rem" }}>
          {LEVELS.map((l) => (
            <button key={l} onClick={()=>setLevel(l)} style={{
              padding:"0.35rem 0.9rem", borderRadius:100, fontSize:"0.78rem", fontWeight:600,
              cursor:"pointer", border:"1px solid", transition:"all 0.15s",
              background: level===l ? "rgba(var(--cyan-rgb),0.12)" : "transparent",
              borderColor: level===l ? "rgba(var(--cyan-rgb),0.4)" : "var(--border)",
              color: level===l ? "var(--cyan)" : "var(--text-mute)",
            }}>{l}</button>
          ))}
          <span style={{ fontSize:"0.8rem", color:"var(--text-mute)", marginLeft:"auto", alignSelf:"center" }}>
            <strong style={{ color:"var(--text)" }}>{filtered.length}</strong> courses
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:"var(--text-mute)" }}>
            No courses match your filters.{" "}
            <button onClick={()=>{setTopic("all");setLevel("All");setSearch("");setFreeOnly(false);}} style={{ background:"none",border:"none",color:"var(--cyan)",cursor:"pointer",fontWeight:600 }}>Clear →</button>
          </div>
        ) : (
          <div className="course-grid">
            {filtered.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="course-card" style={{ textDecoration:"none", color:"inherit", display:"block" }}>
                <div className="course-thumb" style={{ background:c.thumb }}>
                  <span style={{ fontSize:"3.5rem", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{c.icon}</span>
                  {c.free && <span style={{ position:"absolute", top:10, left:10, padding:"2px 9px", borderRadius:6, fontSize:"0.62rem", fontWeight:800, background:"rgba(34,197,94,0.9)", color:"#fff", textTransform:"uppercase" }}>FREE</span>}
                </div>
                <div className="course-body">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.5rem" }}>
                    <span className={`level-pill ${c.level==="Beginner"?"level-begin":c.level==="Intermediate"?"level-inter":"level-adv"}`}>{c.level}</span>
                    <span className="pill">{c.tags[0]}</span>
                  </div>
                  <div className="course-title">{c.title}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"0.85rem" }}>
                    {c.tags.slice(1,3).map((t) => <span key={t} className="pill">{t}</span>)}
                  </div>
                  <div className="course-meta">
                    <span className="course-meta-item">📚 {c.lessons} lessons</span>
                    <span className="course-meta-item">⏱ {c.hours}h</span>
                    <span className="course-meta-item" style={{ marginLeft:"auto", color:c.free?"var(--green)":"var(--text-dim)", fontWeight:c.free?700:400 }}>
                      {c.free?"Free":"Pro"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pro CTA */}
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem 5rem" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(0,212,255,0.12),rgba(168,85,247,0.08))", border:"1px solid rgba(0,212,255,0.2)", borderRadius:"var(--radius-lg)", padding:"3rem", textAlign:"center" }}>
          <h2 style={{ fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.25rem)", letterSpacing:"-0.03em", marginBottom:"0.75rem" }}>
            Unlock all {ALL_COURSES.length} courses with Pro
          </h2>
          <p style={{ color:"var(--text-dim)", fontSize:"1rem", marginBottom:"2rem", maxWidth:440, margin:"0 auto 2rem" }}>
            $16/month for unlimited access to every course, AI path, and project — cancel any time.
          </p>
          <Link href="/auth?mode=signup" className="btn-primary" style={{ margin:"0 auto" }}>Start 7-day free trial →</Link>
        </div>
      </div>
    </div>
  );
}
