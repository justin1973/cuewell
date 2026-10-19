"use client";

import { useState } from "react";
import { sendContact } from "@/app/contact/actions";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setErr(null);
    setBusy(true);
    const r = await sendContact(formData);
    setBusy(false);
    if (r.ok) { setDone(true); return; }
    if (r.error === "unconfigured" || r.error === "send_failed") {
      setErr("We couldn't send that just now — please email us directly at hello@cuewell.io.");
    } else {
      setErr(r.error ?? "Something went wrong. Try again.");
    }
  }

  if (done) {
    return (
      <div className="legal-card" style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 17, marginBottom: 6 }}>Message sent ✓</h3>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
          Thanks for reaching out — we&apos;ll get back to you within a couple of working days.
        </p>
      </div>
    );
  }

  return (
    <form action={submit} className="legal-card">
      <div className="field">
        <label>Your name</label>
        <input className="input" name="name" placeholder="Jane Doe" required />
      </div>
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" name="email" placeholder="you@company.com" required />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea className="input" name="message" rows={5} placeholder="How can we help?" required />
      </div>
      {err && <p style={{ color: "var(--hot)", fontSize: 13, marginBottom: 12 }}>{err}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
    </form>
  );
}
