"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface DLUser {
  id: string; name: string; email: string; password: string;
  joinedAt: string; plan: "free" | "pro";
  coursesEnrolled: string[]; progress: Record<string, number>;
  streak: number; hoursLearned: number;
}

function DigiLearnLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="url(#dla-bg)"/>
      <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.3" strokeDasharray="4 2"/>
      <circle cx="20" cy="9"  r="3.5" fill="url(#dla-n1)"/>
      <circle cx="9"  cy="27" r="3.5" fill="url(#dla-n2)"/>
      <circle cx="31" cy="27" r="3.5" fill="url(#dla-n3)"/>
      <circle cx="20" cy="20" r="2.5" fill="white" fillOpacity="0.9"/>
      <line x1="20" y1="12.5" x2="11"  y2="25"  stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="20" y1="12.5" x2="29"  y2="25"  stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="12.5" y1="27" x2="27.5" y2="27" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="20" y1="12.5" x2="20" y2="17.5" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
      <defs>
        <linearGradient id="dla-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#0284C7"/><stop offset="100%" stopColor="#0369A1"/>
        </linearGradient>
        <radialGradient id="dla-n1"><stop offset="0%" stopColor="#7DD3FC"/><stop offset="100%" stopColor="#38BDF8"/></radialGradient>
        <radialGradient id="dla-n2"><stop offset="0%" stopColor="#FED7AA"/><stop offset="100%" stopColor="#FB923C"/></radialGradient>
        <radialGradient id="dla-n3"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#A78BFA"/></radialGradient>
      </defs>
    </svg>
  );
}

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login"|"signup">(
    (params.get("mode") as "login"|"signup") ?? "login"
  );
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("digilearn_user")) router.replace("/dashboard");
  }, [router]);

  const handleSignup = () => {
    if (!form.name.trim())           return setError("Enter your full name.");
    if (!form.email.includes("@"))   return setError("Enter a valid email.");
    if (form.password.length < 6)    return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    const existing = localStorage.getItem("digilearn_user");
    if (existing && (JSON.parse(existing) as DLUser).email === form.email)
      return setError("An account with this email already exists. Try signing in.");
    const user: DLUser = {
      id: crypto.randomUUID(), name: form.name, email: form.email,
      password: btoa(form.password), joinedAt: new Date().toISOString(),
      plan: "free", coursesEnrolled: ["chatgpt-mastery","python-fund"], progress: { "chatgpt-mastery":0, "python-fund":0 },
      streak: 0, hoursLearned: 0,
    };
    localStorage.setItem("digilearn_user", JSON.stringify(user));
    router.push("/dashboard");
  };

  const handleLogin = () => {
    if (!form.email)    return setError("Enter your email.");
    if (!form.password) return setError("Enter your password.");
    const stored = localStorage.getItem("digilearn_user");
    if (!stored) return setError("No account found. Sign up first.");
    const u: DLUser = JSON.parse(stored);
    if (u.email !== form.email)            return setError("Email not found.");
    if (u.password !== btoa(form.password)) return setError("Incorrect password.");
    router.push("/dashboard");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(() => { mode==="signup" ? handleSignup() : handleLogin(); setLoading(false); }, 600);
  };

  return (
    <div style={{ minHeight:"100svh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem", position:"relative", background:"var(--bg2)" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 20% 20%, rgba(2,132,199,0.06),transparent 55%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(234,88,12,0.04),transparent 50%)", pointerEvents:"none" }} />
      <div className="neural-bg" style={{ position:"absolute", inset:0, opacity:0.3 }} />

      <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:"2.5rem", position:"relative", zIndex:1 }}>
        <DigiLearnLogo size={34} />
        <span style={{ fontWeight:800, fontSize:"1.1rem", color:"var(--text)" }}>DigiLearn</span>
      </Link>

      <div className="auth-card" style={{ position:"relative", zIndex:1 }}>
        <h1 style={{ fontSize:"1.5rem", fontWeight:800, textAlign:"center", marginBottom:"0.375rem" }}>
          {mode==="signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p style={{ fontSize:"0.85rem", color:"var(--text-mute)", textAlign:"center", marginBottom:"1.75rem" }}>
          {mode==="signup" ? "Start learning for free — no card needed" : "Continue your learning journey"}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode==="login"?"active":""}`} onClick={()=>{setMode("login");setError("");}}>Sign in</button>
          <button className={`auth-tab ${mode==="signup"?"active":""}`} onClick={()=>{setMode("signup");setError("");}}>Sign up</button>
        </div>

        <form onSubmit={submit}>
          {mode==="signup" && (<><label className="auth-label">Full name</label><input className="auth-input" type="text" placeholder="Your name" value={form.name} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))}/></>)}
          <label className="auth-label">Email address</label>
          <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm(p=>({...p,email:e.target.value}))}/>
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" placeholder={mode==="signup"?"At least 6 characters":"Your password"} value={form.password} onChange={(e)=>setForm(p=>({...p,password:e.target.value}))}/>
          {mode==="signup" && (<><label className="auth-label">Confirm password</label><input className="auth-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e)=>setForm(p=>({...p,confirm:e.target.value}))}/></>)}

          {error && (
            <div style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:9, padding:"0.75rem 1rem", fontSize:"0.825rem", color:"#FDA4AF", marginBottom:"1rem" }}>{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width:"100%", justifyContent:"center", marginTop:"0.25rem", opacity:loading?0.7:1 }}>
            {loading ? "Just a moment..." : mode==="signup" ? "Create account →" : "Sign in →"}
          </button>
        </form>

        <div className="auth-or"><span>or continue with</span></div>
        <button className="social-btn" onClick={()=>setError("Google OAuth coming soon — use email signup for now")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <button className="social-btn" onClick={()=>setError("GitHub OAuth coming soon — use email signup")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Continue with GitHub
        </button>

        <p style={{ fontSize:"0.75rem", color:"var(--text-mute)", textAlign:"center", marginTop:"1.25rem", lineHeight:1.6 }}>
          {mode==="signup"
            ? <>By signing up you agree to our <span style={{ color:"var(--cyan)", cursor:"pointer", fontWeight:600 }}>Terms</span> and <span style={{ color:"var(--cyan)", cursor:"pointer", fontWeight:600 }}>Privacy Policy</span>.</>
            : <>Don&apos;t have an account?{" "}<button onClick={()=>{setMode("signup");setError("");}} style={{ background:"none",border:"none",color:"var(--cyan)",cursor:"pointer",fontWeight:600,fontSize:"inherit" }}>Sign up free →</button></>
          }
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100svh",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-mute)" }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
