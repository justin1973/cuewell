"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The reset link may carry a PKCE `code`; exchange it for a session so updateUser works.
  useEffect(() => {
    const supabase = createClient();
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) supabase.auth.exchangeCodeForSession(code).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (password.length < 6) { setErr("Use a password of at least 6 characters."); return; }
    if (password !== confirm) { setErr("The two passwords don't match."); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErr("Couldn't update the password — the reset link may have expired. Request a new one from the login page.");
    } else {
      setMsg("Password updated. Taking you to your dashboard…");
      setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 1200);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: "var(--accent)", display: "inline-block" }} />
          Cuewell
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Set a new password</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>Choose a new password for your account.</p>

        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>New password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ marginBottom: 14 }} />
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confirm password</label>
          <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" style={{ marginBottom: 16 }} />

          {err && <p style={{ color: "var(--hot)", fontSize: 13, marginBottom: 12 }}>{err}</p>}
          {msg && <p style={{ color: "var(--ok)", fontSize: 13, marginBottom: 12 }}>{msg}</p>}

          <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Please wait…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
