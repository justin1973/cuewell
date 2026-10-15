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

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    params.get("mode") === "signup" ? "signup" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!email || !password) {
      setErr("Enter your email and password.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setErr("Use a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErr(error.message);
      else setMsg("Check your email to confirm your account, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr("Incorrect email or password.");
      else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, padding: 28 }}>
        <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          <span className="logo" style={{ width: 18, height: 18, borderRadius: 6, background: "var(--accent)", position: "relative", display: "inline-block" }} />
          Cuewell
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>
          {mode === "signup" ? "7-day trial, no credit card required." : "Log in to see your leads."}
        </p>
        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={{ marginBottom: 14 }} />
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ marginBottom: 16 }} />
          {err && <p style={{ color: "var(--hot)", fontSize: 13, marginBottom: 12 }}>{err}</p>}
          {msg && <p style={{ color: "var(--ok)", fontSize: 13, marginBottom: 12 }}>{msg}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16, textAlign: "center" }}>
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErr(null); setMsg(null); }}
            style={{ background: "none", border: 0, color: "var(--ink)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
