"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SESSION_KEY, createCredential, loadAccounts, parseLocalAccount, saveAccounts, saveSession, toSession, verifyCredential, verifyLegacyPassword, type LocalAccount } from "@/lib/local-profile";
import { readLocalValue, writeLocalValue } from "@/lib/learning-storage";

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawSession = readLocalValue(SESSION_KEY);
    if (!rawSession) return;
    try {
      const account = parseLocalAccount(JSON.parse(rawSession));
      if (!account) return;
      const accounts = loadAccounts();
      if (!accounts.some((item) => item.email === account.email)) saveAccounts([...accounts, account]);
      writeLocalValue(SESSION_KEY, JSON.stringify(toSession(account)));
      router.replace("/dashboard");
    } catch { /* Corrupt local sessions are ignored. */ }
  }, [router]);

  async function handleSignup() {
    const name = form.name.trim().replace(/[\u0000-\u001f]/g, "").slice(0, 100);
    const email = form.email.trim().toLowerCase().slice(0, 254);
    if (!name) return setError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (form.password.length < 10 || form.password.length > 128) return setError("Use a password between 10 and 128 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    const accounts = loadAccounts();
    if (accounts.some((account) => account.email === email)) return setError("A local profile with this email already exists. Try signing in.");
    const account: LocalAccount = {
      id: crypto.randomUUID(), name, email, credential: await createCredential(form.password), joinedAt: new Date().toISOString(),
      plan: "free", coursesEnrolled: ["chatgpt-mastery", "python-fund"], progress: { "chatgpt-mastery": 0, "python-fund": 0 }, streak: 0, hoursLearned: 0,
    };
    if (!saveAccounts([...accounts, account]) || !saveSession(account)) return setError("This browser could not save the local profile. Check storage settings.");
    router.push("/dashboard");
  }

  async function handleLogin() {
    const email = form.email.trim().toLowerCase().slice(0, 254);
    if (!email || !form.password) return setError("Enter your email and password.");
    const accounts = loadAccounts();
    const account = accounts.find((item) => item.email === email);
    if (!account) return setError("No local profile was found with that email.");
    const verified = account.credential ? await verifyCredential(form.password, account.credential) : verifyLegacyPassword(form.password, account.password);
    if (!verified) return setError("The password does not match this local profile.");
    let current = account;
    if (!account.credential && account.password) {
      current = { ...account, password: undefined, credential: await createCredential(form.password) };
      const migrated = accounts.map((item) => item.id === current.id ? current : item);
      if (!saveAccounts(migrated)) return setError("The browser could not migrate this local profile.");
    }
    if (!saveSession(current)) return setError("The browser could not start a local session.");
    router.push("/dashboard");
  }

  function handleDemo() {
    const accounts = loadAccounts();
    let demo = accounts.find((item) => item.email === "demo@digilearn.app");
    if (!demo) {
      demo = { id: crypto.randomUUID(), name: "Demo Learner", email: "demo@digilearn.app", joinedAt: new Date().toISOString(), plan: "free", coursesEnrolled: ["chatgpt-mastery", "python-fund", "javascript"], progress: { "chatgpt-mastery": 40, "python-fund": 15, javascript: 0 }, streak: 2, hoursLearned: 5 };
      if (!saveAccounts([...accounts, demo])) return setError("This browser could not save the demo profile.");
    }
    if (!saveSession(demo)) return setError("This browser could not start the demo session.");
    router.push("/dashboard");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(""); setLoading(true);
    try { if (mode === "signup") await handleSignup(); else await handleLogin(); }
    catch { setError("The local profile operation could not be completed."); }
    finally { setLoading(false); setForm((current) => ({ ...current, password: "", confirm: "" })); }
  }

  return <main id="main-content" className="auth-page">
    <Link href="/" className="auth-brand" aria-label="DigiLearn home"><BrandLogo /></Link>
    <section className="auth-card" aria-labelledby="auth-title">
      <h1 id="auth-title">{mode === "signup" ? "Create a profile on this device" : "Open a profile on this device"}</h1>
      <p>{mode === "signup" ? "Organize learning activity in this browser." : "Continue with a profile previously created in this browser."}</p>
      <aside className="auth-boundary"><strong>Device-local only.</strong> This is not a secure online account: there is no cloud sync, email verification, server authorization, password recovery or cross-device access.</aside>
      <div className="auth-tabs" role="group" aria-label="Profile mode"><button type="button" className={`auth-tab ${mode === "login" ? "active" : ""}`} aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); }}>Open existing</button><button type="button" className={`auth-tab ${mode === "signup" ? "active" : ""}`} aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setError(""); }}>Create new</button></div>
      <form onSubmit={submit}>
        {mode === "signup" ? <label className="auth-label">Full name<input className="auth-input" type="text" autoComplete="name" maxLength={100} required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label> : null}
        <label className="auth-label">Email address<input className="auth-input" type="email" autoComplete="email" maxLength={254} required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
        <label className="auth-label">Password<input className="auth-input" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 10 : undefined} maxLength={128} required value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></label>
        {mode === "signup" ? <label className="auth-label">Confirm password<input className="auth-input" type="password" autoComplete="new-password" minLength={10} maxLength={128} required value={form.confirm} onChange={(event) => setForm((current) => ({ ...current, confirm: event.target.value }))} /></label> : null}
        {error ? <div className="auth-error" role="alert">{error}</div> : null}
        <button type="submit" disabled={loading} className="button primary auth-submit">{loading ? "Working..." : mode === "signup" ? "Create device profile" : "Open device profile"}</button>
      </form>
      <div className="auth-or"><span>or</span></div>
      <button type="button" className="button quiet auth-submit" onClick={handleDemo} disabled={loading}>Explore with a demo profile</button>
      <p className="auth-footnote">Credential verification happens only in this browser. It does not protect data from another script running on this origin or someone with access to this device.</p>
    </section>
  </main>;
}

export default function AuthPage() {
  return <Suspense fallback={<main className="route-state" aria-busy="true"><BrandLogo /><p>Loading local profile...</p></main>}><AuthContent /></Suspense>;
}
