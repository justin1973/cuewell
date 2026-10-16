"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

type Mode = "login" | "signup" | "forgot";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(params.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(m: Mode) {
    setMode(m); setErr(null); setMsg(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);

    if (!email) { setErr("Enter your email."); return; }
    if (mode !== "forgot" && !password) { setErr("Enter your password."); return; }
    if (mode === "signup" && password.length < 6) {
      setErr("Use a password of at least 6 characters."); return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErr(error.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // Supabase hides duplicates for security; an empty identities array is the tell.
        setErr("This email is already registered. Try logging in instead.");
      } else {
        setMsg("Check your email to confirm your account, then log in.");
      }
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      // Always show the same message, whether or not the email exists (no enumeration).
      if (error) setErr(error.message);
      else setMsg("If that email has an account, we've sent a reset link. Check your inbox.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr("Incorrect email or password.");
      else { router.push("/dashboard"); router.refresh(); }
    }

    setLoading(false);
  }

  const title = mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Welcome back";
  const sub = mode === "signup" ? "7-day trial, no credit card required."
    : mode === "forgot" ? "We'll email you a link to set a new password."
    : "Log in to see your leads.";
  const cta = loading ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Log in";

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, padding: 28 }}>
        <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          <span className="logo" style={{ width: 18, height: 18, borderRadius: 6, background: "var(--accent)", display: "inline-block" }} />
          Cuewell
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>{title}</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>{sub}</p>

        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={{ marginBottom: 14 }} />

          {mode !== "forgot" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
                {mode === "login" && (
                  <button type="button" onClick={() => switchMode("forgot")} style={{ background: "none", border: 0, color: "var(--accent)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ marginBottom: 16 }} />
            </>
          )}

          {err && <p style={{ color: "var(--hot)", fontSize: 13, marginBottom: 12 }}>{err}</p>}
          {msg && <p style={{ color: "var(--ok)", fontSize: 13, marginBottom: 12 }}>{msg}</p>}

          <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={loading}>{cta}</button>
        </form>

        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16, textAlign: "center" }}>
          {mode === "forgot" ? (
            <>Remembered it? <button onClick={() => switchMode("login")} style={linkBtn}>Back to login</button></>
          ) : mode === "signup" ? (
            <>Already have an account? <button onClick={() => switchMode("login")} style={linkBtn}>Log in</button></>
          ) : (
            <>Don&apos;t have an account? <button onClick={() => switchMode("signup")} style={linkBtn}>Sign up</button></>
          )}
        </p>
      </div>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  background: "none", border: 0, color: "var(--ink)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
};
