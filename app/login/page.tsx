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
      setErr("Inserisci email e password.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErr(error.message);
      else setMsg("Controlla la tua email per confermare l'account, poi accedi.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr("Email o password non corretti.");
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
          {mode === "signup" ? "Crea il tuo account" : "Bentornato"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>
          {mode === "signup" ? "7 giorni di prova, nessuna carta richiesta." : "Accedi per vedere i tuoi lead."}
        </p>
        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@azienda.com" style={{ marginBottom: 14 }} />
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ marginBottom: 16 }} />
          {err && <p style={{ color: "var(--hot)", fontSize: 13, marginBottom: 12 }}>{err}</p>}
          {msg && <p style={{ color: "var(--ok)", fontSize: 13, marginBottom: 12 }}>{msg}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Attendi…" : mode === "signup" ? "Crea account" : "Accedi"}
          </button>
        </form>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16, textAlign: "center" }}>
          {mode === "signup" ? "Hai già un account? " : "Non hai un account? "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErr(null); setMsg(null); }}
            style={{ background: "none", border: 0, color: "var(--ink)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
          >
            {mode === "signup" ? "Accedi" : "Registrati"}
          </button>
        </p>
      </div>
    </div>
  );
}
