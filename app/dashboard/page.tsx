"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DLUser {
  id: string; name: string; email: string; password: string;
  joinedAt: string; plan: "free" | "pro";
  coursesEnrolled: string[]; progress: Record<string, number>;
  streak: number; hoursLearned: number;
}

const COURSE_CATALOG: Record<string, { title: string; icon: string; lessons: number; color: string; topic: string }> = {
  "chatgpt-mastery":   { title:"ChatGPT & GPT-4o Mastery",       icon:"🤖", lessons:38, color:"#00D4FF", topic:"AI Tools" },
  "claude-mastery":    { title:"Claude — Advanced AI Workflows",  icon:"🧬", lessons:34, color:"#A855F7", topic:"AI Tools" },
  "prompt-engineering":{ title:"Prompt Engineering Pro",          icon:"🧠", lessons:44, color:"#FF7A00", topic:"AI" },
  "python-fund":       { title:"Python Fundamentals",             icon:"🐍", lessons:52, color:"#22C55E", topic:"Data" },
  "python-ai":         { title:"Python for AI & Data Science",    icon:"🤖", lessons:58, color:"#16A34A", topic:"Data" },
  "javascript":        { title:"JavaScript: Zero to Pro",         icon:"⚡", lessons:62, color:"#FBBF24", topic:"Web Dev" },
  "react-nextjs":      { title:"React & Next.js 16",              icon:"⚛️", lessons:54, color:"#06B6D4", topic:"Web Dev" },
  "make-automation":   { title:"Make — Automate Everything",      icon:"⚙️", lessons:34, color:"#22C55E", topic:"Automation" },
  "security-fundamentals":{ title:"Cybersecurity Fundamentals",  icon:"🔐", lessons:46, color:"#F43F5E", topic:"Security" },
  "machine-learning":  { title:"Machine Learning A-Z",            icon:"⚙️", lessons:68, color:"#A855F7", topic:"Data" },
  "ai-productivity":   { title:"AI Productivity System",          icon:"⚡", lessons:22, color:"#00D4FF", topic:"AI Tools" },
  "digital-biz":       { title:"Build a Digital Business",        icon:"🏪", lessons:48, color:"#FF7A00", topic:"Business" },
};

const ANNOUNCEMENTS = [
  { icon:"🚀", text:"New: Claude Mastery course just launched — 34 in-depth lessons on Claude AI workflows." },
  { icon:"🤖", text:"AI Agents & LLM Apps added to the AI path — build your first agent today." },
  { icon:"🏆", text:"July challenge: Complete 3 AI courses for the AI Pioneer badge and 500 XP." },
];

const DAILY = [
  { title:"Write a prompt that returns JSON", topic:"Prompt Engineering", xp:40, diff:"Easy" },
  { title:"Build a Python data cleaning pipeline", topic:"Python", xp:65, diff:"Medium" },
  { title:"Create a Make.com automation for Gmail", topic:"Automation", xp:55, diff:"Medium" },
];

function DigiLearnLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="url(#dl-d-bg)"/>
      <circle cx="18" cy="18" r="8" stroke="url(#dl-d-ring)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="2.5" fill="#00D4FF"/><circle cx="10" cy="22" r="2.5" fill="#FF7A00"/><circle cx="26" cy="22" r="2.5" fill="#A855F7"/>
      <line x1="18" y1="12.5" x2="12" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="18" y1="12.5" x2="24" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="12.5" y1="22" x2="23.5" y2="22" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4"/>
      <defs>
        <linearGradient id="dl-d-bg" x1="0" y1="0" x2="36" y2="36"><stop offset="0%" stopColor="#061A24"/><stop offset="100%" stopColor="#050508"/></linearGradient>
        <linearGradient id="dl-d-ring" x1="10" y1="10" x2="26" y2="26"><stop offset="0%" stopColor="#00D4FF"/><stop offset="100%" stopColor="#0077AA"/></linearGradient>
      </defs>
    </svg>
  );
}

const VIEWS = [
  { id:"home", icon:"🏠", label:"Dashboard" },
  { id:"courses", icon:"📚", label:"My Courses" },
  { id:"paths", icon:"🛣️", label:"Learning Paths" },
  { id:"tools", icon:"🤖", label:"AI Tools Hub" },
  { id:"challenges", icon:"⚔️", label:"Daily Challenges" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DLUser | null>(null);
  const [view, setView] = useState<string>("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("digilearn_user");
    if (!stored) { router.replace("/auth"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  const logout = () => { localStorage.removeItem("digilearn_user"); router.push("/"); };

  const enroll = (id: string) => {
    if (!user || user.coursesEnrolled.includes(id)) return;
    const updated = { ...user, coursesEnrolled:[...user.coursesEnrolled,id], progress:{...user.progress,[id]:0} };
    localStorage.setItem("digilearn_user", JSON.stringify(updated));
    setUser(updated);
  };

  const advanceProgress = (id: string) => {
    if (!user) return;
    const cur = user.progress[id] ?? 0;
    const next = Math.min(cur + Math.floor(Math.random()*14)+6, 100);
    const updated = { ...user, progress:{...user.progress,[id]:next}, hoursLearned:user.hoursLearned+1, streak: Math.max(user.streak, 1) };
    localStorage.setItem("digilearn_user", JSON.stringify(updated));
    setUser(updated);
  };

  const greet = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  if (!mounted || !user) return (
    <div style={{ minHeight:"100svh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}>
      <div style={{ width:36,height:36,borderRadius:"50%",border:"3px solid var(--border)",borderTopColor:"var(--cyan)",animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ color:"var(--text-mute)", fontSize:"0.875rem" }}>Loading your dashboard...</span>
    </div>
  );

  const enrolled = user.coursesEnrolled;
  const inProgress = enrolled.filter(id => (user.progress[id]??0) > 0 && user.progress[id] < 100);
  const completed  = enrolled.filter(id => user.progress[id] === 100);

  return (
    <div style={{ display:"flex", minHeight:"100svh" }}>
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.5rem 1rem 1.5rem", borderBottom:"1px solid var(--border)", marginBottom:"0.75rem" }}>
          <DigiLearnLogo size={26} />
          <span style={{ fontWeight:800, fontSize:"0.9rem" }}>DigiLearn</span>
        </div>
        {VIEWS.map((v) => (
          <button key={v.id} className={`dash-nav-item ${view===v.id?"active":""}`} onClick={()=>setView(v.id)}>
            <span style={{ fontSize:"1rem", width:20, textAlign:"center" }}>{v.icon}</span>
            {v.label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <div style={{ padding:"1rem", background:"var(--surface)", borderRadius:10, marginBottom:"0.75rem" }}>
          <div style={{ fontSize:"0.68rem", color:"var(--text-mute)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.4rem" }}>Plan</div>
          <div style={{ fontWeight:800, fontSize:"0.9rem", textTransform:"capitalize", color: user.plan==="pro"?"var(--cyan)":undefined }}>{user.plan}</div>
          {user.plan==="free" && <Link href="/auth" style={{ fontSize:"0.72rem", color:"var(--cyan)", fontWeight:600, textDecoration:"none" }}>Upgrade to Pro →</Link>}
        </div>
        <button className="dash-nav-item" onClick={logout} style={{ color:"var(--rose)" }}>
          <span style={{ fontSize:"1rem", width:20, textAlign:"center" }}>🚪</span> Sign out
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, overflow:"auto", padding:"2rem", background:"var(--bg)" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.03em" }}>
              {greet()}, {user.name.split(" ")[0]}! 👋
            </h1>
            <p style={{ color:"var(--text-mute)", fontSize:"0.875rem", marginTop:4 }}>
              {inProgress.length > 0 ? `${inProgress.length} course${inProgress.length>1?"s":""} in progress — keep the momentum going.` : "Ready to start? Pick a course below."}
            </p>
          </div>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,var(--cyan),#0099CC)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.9rem", color:"#000" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {view === "home" && (
          <>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
              {[
                { label:"Enrolled",   num:enrolled.length,    icon:"📚", color:"var(--cyan)" },
                { label:"Completed",  num:completed.length,   icon:"✅", color:"var(--green)" },
                { label:"Hours",      num:user.hoursLearned,  icon:"⏱",  color:"var(--orange)" },
                { label:"Day streak", num:user.streak,        icon:"🔥", color:"var(--amber)" },
              ].map((s) => (
                <div key={s.label} className="dash-stat-card">
                  <span style={{ fontSize:"1.4rem" }}>{s.icon}</span>
                  <div className="dash-stat-num" style={{ color:s.color }}>{s.num}</div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Announcements */}
            <div className="dash-card" style={{ marginBottom:"2rem" }}>
              <div style={{ fontWeight:800, marginBottom:"1rem", fontSize:"0.95rem" }}>What&apos;s new on DigiLearn</div>
              {ANNOUNCEMENTS.map((a, i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"0.625rem 0", borderBottom: i<ANNOUNCEMENTS.length-1?"1px solid var(--border)":"none" }}>
                  <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{a.icon}</span>
                  <span style={{ fontSize:"0.875rem", color:"var(--text-dim)", lineHeight:1.6 }}>{a.text}</span>
                </div>
              ))}
            </div>

            {/* Continue learning */}
            <div style={{ marginBottom:"2rem" }}>
              <div style={{ fontWeight:800, marginBottom:"1rem", fontSize:"0.95rem" }}>Continue learning</div>
              {inProgress.length === 0 ? (
                <div className="dash-card" style={{ textAlign:"center", padding:"2.5rem", color:"var(--text-mute)", fontSize:"0.875rem" }}>
                  No courses started yet.{" "}
                  <button onClick={()=>setView("courses")} style={{ background:"none",border:"none",color:"var(--cyan)",cursor:"pointer",fontWeight:600,fontSize:"inherit" }}>Browse courses →</button>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,360px),1fr))", gap:"1rem" }}>
                  {inProgress.map((id) => {
                    const info = COURSE_CATALOG[id]; if (!info) return null;
                    const pct = user.progress[id] ?? 0;
                    return (
                      <div key={id} className="dash-card" style={{ display:"flex", flexDirection:"column", gap:12 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <span style={{ fontSize:"1.75rem" }}>{info.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:"0.9rem" }}>{info.title}</div>
                            <div style={{ fontSize:"0.73rem", color:"var(--text-mute)", marginTop:3 }}>{info.topic} · {Math.round(pct/100*info.lessons)}/{info.lessons} lessons</div>
                          </div>
                          <span style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.875rem", fontWeight:700, color:info.color }}>{pct}%</span>
                        </div>
                        <div className="progress-wrap">
                          <div className="progress-bar" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${info.color},${info.color}88)` }} />
                        </div>
                        <button onClick={()=>advanceProgress(id)} className="btn-primary" style={{ padding:"0.55rem 1.25rem", fontSize:"0.825rem" }}>Continue →</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daily challenges */}
            <div>
              <div style={{ fontWeight:800, marginBottom:"1rem", fontSize:"0.95rem" }}>Today&apos;s challenges</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                {DAILY.map((d, i) => (
                  <div key={i} className="dash-card" style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:"0.9rem" }}>{d.title}</div>
                      <div style={{ fontSize:"0.75rem", color:"var(--text-mute)", marginTop:3 }}>{d.topic} · {d.diff}</div>
                    </div>
                    <span style={{ fontSize:"0.75rem", color:"var(--amber)", fontWeight:700 }}>+{d.xp} XP</span>
                    <button className="btn-ghost" style={{ padding:"0.4rem 1rem", fontSize:"0.8rem" }}>Start</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "courses" && (
          <div>
            <h2 style={{ fontWeight:800, fontSize:"1.3rem", marginBottom:"1.5rem" }}>My Courses</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,290px),1fr))", gap:"1rem" }}>
              {Object.entries(COURSE_CATALOG).map(([id, info]) => {
                const isEnrolled = enrolled.includes(id);
                const pct = user.progress[id] ?? 0;
                return (
                  <div key={id} className="dash-card" style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <span style={{ fontSize:"1.85rem" }}>{info.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"0.875rem", lineHeight:1.35 }}>{info.title}</div>
                        <div style={{ fontSize:"0.72rem", color:"var(--text-mute)", marginTop:3 }}>{info.topic} · {info.lessons} lessons</div>
                      </div>
                    </div>
                    {isEnrolled ? (
                      <>
                        <div className="progress-wrap">
                          <div className="progress-bar" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${info.color},${info.color}88)` }} />
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.73rem", color:"var(--text-mute)" }}>
                          <span>{pct}% done</span>
                          <span>{pct===100?"✅ Completed":`${Math.round(pct/100*info.lessons)}/${info.lessons}`}</span>
                        </div>
                        <button onClick={()=>advanceProgress(id)} className="btn-primary" style={{ padding:"0.5rem", fontSize:"0.8rem" }}>
                          {pct===0?"Start course →":pct===100?"Review":"Continue →"}
                        </button>
                      </>
                    ) : (
                      <button onClick={()=>enroll(id)} className="btn-ghost" style={{ padding:"0.5rem", fontSize:"0.8rem" }}>Enroll free →</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "paths" && (
          <div>
            <h2 style={{ fontWeight:800, fontSize:"1.3rem", marginBottom:"0.5rem" }}>Learning Paths</h2>
            <p style={{ color:"var(--text-mute)", fontSize:"0.875rem", marginBottom:"2rem" }}>Structured sequences from beginner to job-ready in a specific discipline.</p>
            {[
              { title:"AI Power User", icon:"🤖", ids:["chatgpt-mastery","claude-mastery","prompt-engineering","ai-productivity"], color:"var(--cyan)", duration:"3 months" },
              { title:"Web Developer",  icon:"👨‍💻", ids:["html-css","javascript","react-nextjs","fullstack"],              color:"var(--orange)", duration:"9 months" },
              { title:"AI/ML Engineer", icon:"🧠", ids:["python-fund","python-ai","machine-learning","deep-learning"],        color:"var(--violet)", duration:"10 months" },
              { title:"Automation Specialist", icon:"⚙️", ids:["make-automation","n8n","zapier","ai-productivity"],           color:"var(--green)", duration:"4 months" },
            ].map((path, i) => {
              const pathPcts = path.ids.map(id => user.progress[id]??0);
              const avg = Math.round(pathPcts.reduce((a,b)=>a+b,0)/path.ids.length);
              return (
                <div key={i} className="dash-card" style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                    <span style={{ fontSize:"2rem" }}>{path.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:"1rem", marginBottom:6 }}>{path.title}</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                        {path.ids.map(id => COURSE_CATALOG[id] && (
                          <span key={id} style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:6, background:"var(--bg3)", color:"var(--text-mute)", border:"1px solid var(--border)" }}>
                            {COURSE_CATALOG[id].icon} {COURSE_CATALOG[id].title.split(":")[0].split("—")[0].trim()}
                          </span>
                        ))}
                      </div>
                      <div className="progress-wrap" style={{ maxWidth:360 }}>
                        <div className="progress-bar" style={{ width:`${avg}%`, background:`linear-gradient(90deg,${path.color},${path.color}88)` }} />
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"1.25rem", fontWeight:900, color:path.color }}>{avg}%</div>
                      <div style={{ fontSize:"0.73rem", color:"var(--text-mute)" }}>{path.duration}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "tools" && (
          <div>
            <h2 style={{ fontWeight:800, fontSize:"1.3rem", marginBottom:"0.5rem" }}>AI Tools Hub</h2>
            <p style={{ color:"var(--text-mute)", fontSize:"0.875rem", marginBottom:"2rem" }}>Quick-access links and resources for the AI tools covered in DigiLearn.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,280px),1fr))", gap:"1rem" }}>
              {[
                { name:"ChatGPT", icon:"🤖", desc:"OpenAI's flagship model. Start here if you're new to AI.", link:"https://chatgpt.com", color:"var(--green)" },
                { name:"Claude",  icon:"🧬", desc:"Anthropic's AI — best for long documents and analysis.", link:"https://claude.ai", color:"var(--violet)" },
                { name:"Perplexity",icon:"🔍", desc:"AI search engine. Use for research and fact-checking.", link:"https://perplexity.ai", color:"var(--cyan)" },
                { name:"Midjourney",icon:"🎨", desc:"Best AI image generator. Via Discord.", link:"https://midjourney.com", color:"var(--orange)" },
                { name:"GitHub Copilot",icon:"🤝", desc:"AI pair programmer. Works inside VS Code.", link:"https://github.com/features/copilot", color:"#6e40c9" },
                { name:"Make",    icon:"⚙️", desc:"Visual automation platform. Connect any app.", link:"https://make.com", color:"var(--green)" },
                { name:"ElevenLabs",icon:"🎵", desc:"Best AI voice and audio generation.", link:"https://elevenlabs.io", color:"var(--orange)" },
                { name:"Runway ML",icon:"🎬", desc:"AI video generation and editing.", link:"https://runwayml.com", color:"var(--rose)" },
                { name:"Notion AI",icon:"📝", desc:"AI built into Notion. Drafts, summaries, databases.", link:"https://notion.so", color:"var(--text)" },
              ].map((tool) => (
                <a key={tool.name} href={tool.link} target="_blank" rel="noopener" style={{ textDecoration:"none" }}>
                  <div className="dash-card" style={{ cursor:"pointer", transition:"all 0.2s", borderColor:"var(--border)" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor=tool.color}
                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)"}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                      <span style={{ fontSize:"1.5rem" }}>{tool.icon}</span>
                      <span style={{ fontWeight:700, fontSize:"0.95rem" }}>{tool.name}</span>
                      <span style={{ marginLeft:"auto", fontSize:"0.7rem", color:tool.color }}>→</span>
                    </div>
                    <div style={{ fontSize:"0.8rem", color:"var(--text-mute)", lineHeight:1.6 }}>{tool.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {view === "challenges" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, textAlign:"center", gap:16 }}>
            <span style={{ fontSize:"3.5rem" }}>⚔️</span>
            <h2 style={{ fontWeight:800, fontSize:"1.3rem" }}>Code & AI Challenges</h2>
            <p style={{ color:"var(--text-mute)", maxWidth:420, lineHeight:1.75, fontSize:"0.875rem" }}>
              Daily prompt challenges, coding problems, automation puzzles, and project-based assessments. Launching soon — you&apos;ll earn XP and unlock badges.
            </p>
            <div style={{ padding:"0.625rem 1.5rem", borderRadius:9, background:"rgba(var(--cyan-rgb),0.08)", border:"1px solid rgba(var(--cyan-rgb),0.2)", color:"var(--cyan)", fontSize:"0.8rem", fontWeight:600 }}>
              Coming soon — you&apos;ll be first to know
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
