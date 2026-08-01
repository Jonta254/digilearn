"use client";
import { useEffect, useRef, useState } from "react";
import { formatKES } from "@/lib/pricing";

type Phase = "form" | "pending" | "success" | "error";

export default function PaywallModal({
  course, price, onClose, onUnlocked,
}: {
  course: { id: string; title: string; lessons: number };
  price: number;
  onClose: () => void;
  onUnlocked: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [message, setMessage] = useState("");
  const cancelled = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && phase !== "pending") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { cancelled.current = true; window.removeEventListener("keydown", onKey); };
  }, [onClose, phase]);

  const pollStatus = async (checkoutRequestId: string) => {
    const maxTries = 20;      // ~80s total
    const intervalMs = 4000;
    for (let i = 0; i < maxTries; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      if (cancelled.current) return;
      try {
        const res = await fetch("/api/mpesa/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestId }),
        });
        const data = await res.json();
        if (cancelled.current) return;
        if (data.status === "success") {
          setPhase("success");
          setMessage("Payment received — your course is unlocked.");
          onUnlocked();
          setTimeout(() => { if (!cancelled.current) onClose(); }, 1800);
          return;
        }
        if (data.status === "failed") {
          setPhase("error");
          setMessage(data.resultDesc || "Payment was not completed.");
          return;
        }
        // pending → keep waiting
      } catch {
        // transient network error → keep waiting
      }
    }
    if (!cancelled.current) {
      setPhase("error");
      setMessage("Timed out waiting for confirmation. If you completed the payment, reopen this course.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("pending");
    setMessage("Sending an M-Pesa prompt to your phone…");
    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, itemId: course.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhase("error");
        setMessage(
          data.code === "not_configured"
            ? "M-Pesa isn't configured on this deployment yet. Add your Daraja keys to enable payments."
            : data.error || "Could not start the payment.",
        );
        return;
      }
      setMessage(data.customerMessage || "Check your phone and enter your M-Pesa PIN.");
      pollStatus(data.checkoutRequestId);
    } catch {
      setPhase("error");
      setMessage("Network error. Please try again.");
    }
  };

  const C = { primary: "#0284C7", text: "#0F172A", dim: "#475569", mute: "#94A3B8", border: "rgba(15,23,42,0.12)", green: "#16A34A", rose: "#E11D48" };

  return (
    <div
      role="dialog" aria-modal="true" aria-label={`Unlock ${course.title}`}
      onClick={() => phase !== "pending" && onClose()}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 18, boxShadow: "0 24px 60px rgba(15,23,42,0.28)", overflow: "hidden", fontFamily: "'Inter',sans-serif", color: C.text }}
      >
        {/* Header */}
        <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>💚</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: "1rem" }}>Unlock this course</div>
            <div style={{ fontSize: "0.8rem", color: C.mute, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</div>
          </div>
          <button onClick={onClose} disabled={phase === "pending"} aria-label="Close" style={{ background: "none", border: "none", fontSize: "1.3rem", lineHeight: 1, color: C.mute, cursor: phase === "pending" ? "not-allowed" : "pointer", padding: 2 }}>×</button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {(phase === "form" || phase === "error") && (
            <form onSubmit={submit}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em" }}>{formatKES(price)}</span>
                <span style={{ fontSize: "0.8rem", color: C.mute }}>one-time · lifetime access</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: C.dim, lineHeight: 1.6, margin: "0.5rem 0 1.25rem" }}>
                Unlock all {course.lessons} lessons. Pay securely with M-Pesa — enter your number and approve the prompt on your phone.
              </p>

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: C.dim, marginBottom: 6 }}>M-Pesa phone number</label>
              <input
                ref={inputRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="0712 345 678"
                required
                style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: "0.95rem", outline: "none", fontFamily: "inherit", marginBottom: message && phase === "error" ? 12 : 16 }}
              />

              {phase === "error" && message && (
                <div style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.25)", color: C.rose, borderRadius: 9, padding: "0.7rem 0.9rem", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: 16 }}>{message}</div>
              )}

              <button type="submit" style={{ width: "100%", padding: "0.85rem", borderRadius: 10, border: "none", background: C.primary, color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "inherit" }}>
                {phase === "error" ? "Try again" : `Pay ${formatKES(price)} with M-Pesa`}
              </button>
              <p style={{ fontSize: "0.72rem", color: C.mute, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                You&apos;ll get a prompt from Safaricom. We never see your M-Pesa PIN.
              </p>
            </form>
          )}

          {phase === "pending" && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.primary, margin: "0 auto 1.25rem", animation: "dl-spin 0.8s linear infinite" }} />
              <style>{`@keyframes dl-spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 }}>Waiting for your approval…</div>
              <p style={{ fontSize: "0.85rem", color: C.dim, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>{message}</p>
              <p style={{ fontSize: "0.72rem", color: C.mute, marginTop: 14 }}>Enter your M-Pesa PIN on your phone to complete.</p>
            </div>
          )}

          {phase === "success" && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#DCFCE7", color: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", margin: "0 auto 1rem" }}>✓</div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 6 }}>You&apos;re in!</div>
              <p style={{ fontSize: "0.85rem", color: C.dim }}>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
