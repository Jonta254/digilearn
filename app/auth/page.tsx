"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { loadAccounts, saveAccounts, saveSession, type LocalProfile } from "@/lib/local-profile";

export default function DeviceProfilePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<LocalProfile[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const migrated = loadAccounts();
    setProfiles(migrated);
    // Rewrite legacy browser records without obsolete credential-like fields.
    saveAccounts(migrated);
  }, []);
  function open(profile: LocalProfile) { if (!saveSession(profile)) return setError("This browser could not open the device profile."); router.push("/dashboard"); }
  function create(event: React.FormEvent) {
    event.preventDefault(); const safeName = name.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 100);
    if (!safeName) return setError("Enter a name for this device profile.");
    const profile = { id: crypto.randomUUID(), name: safeName, joinedAt: new Date().toISOString() };
    if (!saveAccounts([...profiles, profile]) || !saveSession(profile)) return setError("This browser could not save the device profile.");
    router.push("/dashboard");
  }
  function demo() { const profile = { id: "demo-learner", name: "Demo learner", joinedAt: new Date().toISOString() }; if (!saveSession(profile)) return setError("This browser could not start the demo profile."); router.push("/dashboard"); }
  return <main id="main-content" className="auth-page"><Link href="/" className="auth-brand" aria-label="DigiLearn home"><BrandLogo /></Link><section className="auth-card" aria-labelledby="profile-title">
    <p className="eyebrow">Optional device profile</p><h1 id="profile-title">Keep a name with this browser</h1><p>This convenience profile is not an online account and is never used to authorize access or payments.</p>
    <aside className="auth-boundary"><strong>No email or password required.</strong> Learning records stay in this browser and can be erased with browser data.</aside>
    {profiles.length ? <section aria-labelledby="existing-title"><h2 id="existing-title">Profiles on this device</h2><div className="device-profile-list">{profiles.map((profile) => <button className="button quiet" type="button" key={profile.id} onClick={() => open(profile)}>Continue as {profile.name}</button>)}</div></section> : null}
    <form onSubmit={create}><label className="auth-label">Profile name<input className="auth-input" type="text" autoComplete="name" maxLength={100} required value={name} onChange={(event) => setName(event.target.value)} /></label>{error ? <div className="auth-error" role="alert">{error}</div> : null}<button type="submit" className="button primary auth-submit">Create device profile</button></form>
    <div className="auth-or"><span>or</span></div><button type="button" className="button quiet auth-submit" onClick={demo}>Explore without creating one</button><p className="auth-footnote">A future payment account must use separately verified server-side identity. This device profile will not prove identity or ownership.</p>
  </section></main>;
}
