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

// Accounts registry (all sign-ups) vs. the active session. Keeping them
// separate is what lets more than one account exist and sign in later.
const ACCOUNTS_KEY = "digilearn_accounts";
const SESSION_KEY = "digilearn_user";

const loadAccounts = (): DLUser[] => {
  try { const v = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch { return []; }
};
const saveAccounts = (list: DLUser[]) => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));

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
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      // Migrate a legacy single-user session into the accounts registry so it
      // can still be signed into after a future logout.
      try {
        const u = JSON.parse(session) as DLUser;
        const accounts = loadAccounts();
        if (u?.email && !accounts.some(a => a.email.toLowerCase() === u.email.toLowerCase())) {
          saveAccounts([...accounts, u]);
        }
      } catch { /* ignore corrupt session */ }
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSignup = () => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name)                          return setError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (form.password.length < 6)       return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    const accounts = loadAccounts();
    if (accounts.some(a => a.email.toLowerCase() === email))
      return setError("An account with this email already exists. Try signing in.");
    const user: DLUser = {
      id: crypto.randomUUID(), name, email,
      password: btoa(form.password), joinedAt: new Date().toISOString(),
      plan: "free", coursesEnrolled: ["chatgpt-mastery","python-fund"], progress: { "chatgpt-mastery":0, "python-fund":0 },
      streak: 0, hoursLearned: 0,
    };
    saveAccounts([...accounts, user]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    router.push("/dashboard");
  };

  const handleLogin = () => {
    const email = form.email.trim().toLowerCase();
    if (!email)         return setError("Enter your email.");
    if (!form.password) return setError("Enter your password.");
    const account = loadAccounts().find(a => a.email.toLowerCase() === email);
    if (!account)                              return setError("No account found with that email. Sign up first.");
    if (account.password !== btoa(form.password)) return setError("Incorrect password. Try again.");
    localStorage.setItem(SESSION_KEY, JSON.stringify(account));
    router.push("/dashboard");
  };

  // A real, working way in without a backend: a self-contained demo account.
  const handleDemo = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      const accounts = loadAccounts();
      let demo = accounts.find(a => a.email === "demo@digilearn.app");
      if (!demo) {
        demo = {
          id: crypto.randomUUID(), name: "Demo Learner", email: "demo@digilearn.app",
          password: btoa("demo-account"), joinedAt: new Date().toISOString(),
          plan: "free",
          coursesEnrolled: ["chatgpt-mastery","python-fund","javascript"],
          progress: { "chatgpt-mastery": 40, "python-fund": 15, "javascript": 0 },
          streak: 2, hoursLearned: 5,
        };
        saveAccounts([...accounts, demo]);
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(demo));
      router.push("/dashboard");
    }, 400);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(() => { if (mode==="signup") handleSignup(); else handleLogin(); setLoading(false); }, 600);
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

        <div className="auth-or"><span>or</span></div>
        <button type="button" className="social-btn" onClick={handleDemo} disabled={loading}>
          <span style={{ fontSize:"1.05rem" }}>🚀</span>
          Explore with a demo account
        </button>
        <p style={{ fontSize:"0.72rem", color:"var(--text-mute)", textAlign:"center", marginTop:"0.5rem", lineHeight:1.5 }}>
          No sign-up needed — jumps straight into a sample dashboard.
        </p>

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
