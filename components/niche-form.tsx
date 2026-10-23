"use client";

import { useState } from "react";
import Link from "next/link";
import { createWatch, updateWatch, suggestNiche } from "@/app/dashboard/actions";
import { Icon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import type { Watch } from "@/components/niche-card";

export function NicheForm({
  watch, isPro, wizardRemaining, showCancel,
}: { watch?: Watch; isPro: boolean; wizardRemaining: number | null; showCancel: boolean }) {
  const editing = !!watch;

  const [name, setName] = useState(watch?.name ?? "");
  const [niche, setNiche] = useState(watch?.niche_description ?? "");
  const [include, setInclude] = useState((watch?.include_keywords ?? []).join(", "));
  const [exclude, setExclude] = useState((watch?.exclude_keywords ?? []).join(", "));
  const [minScore, setMinScore] = useState<number>(watch?.min_score ?? 5);

  const [desc, setDesc] = useState("");
  const [remaining, setRemaining] = useState<number | null>(wizardRemaining);
  const [busy, setBusy] = useState(false);
  const [wizErr, setWizErr] = useState<string | null>(null);

  const outOfUses = !isPro && (remaining ?? 0) <= 0;
  const action = editing ? updateWatch : createWatch;

  async function generate() {
    setWizErr(null);
    if (desc.trim().length < 3) { setWizErr("Describe what you sell first."); return; }
    setBusy(true);
    const r = await suggestNiche(desc);
    setBusy(false);
    if (typeof r.remaining === "number") setRemaining(r.remaining);
    if (!r.ok || !r.suggestion) { setWizErr(r.error ?? "Couldn't generate. Try again."); return; }
    const s = r.suggestion;
    setName(s.name);
    setNiche(s.niche_description);
    setInclude(s.include_keywords.join(", "));
    setExclude(s.exclude_keywords.join(", "));
    setMinScore(s.min_score);
  }

  return (
    <>
      {/* Wizard */}
      <div className="panel wizard">
        <h3><Icon name="zap" />Niche wizard</h3>
        <p className="ph">Describe what you sell in one sentence — the AI drafts the keywords for you. You can edit everything before saving.</p>
        <textarea
          className="input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. An email tool for startups leaving Mailchimp — or a freelance React developer for SaaS teams"
          disabled={outOfUses}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary sm" onClick={generate} disabled={busy || outOfUses}>
            <Icon name="zap" />{busy ? "Thinking…" : "Generate with AI"}
          </button>
          {!isPro && !outOfUses && remaining !== null && (
            <span className="hint">{remaining} free {remaining === 1 ? "suggestion" : "suggestions"} left</span>
          )}
          {outOfUses && (
            <span className="hint">No free suggestions left — <Link href="/dashboard/account" style={{ color: "var(--accent)", fontWeight: 600 }}>upgrade to Pro</Link> for unlimited.</span>
          )}
        </div>
        {wizErr && <p style={{ color: "var(--hot)", fontSize: 13, marginTop: 8 }}>{wizErr}</p>}
      </div>

      {/* The niche form */}
      <form action={action} className="panel">
        {editing && <input type="hidden" name="id" value={watch!.id} />}
        <div className="field">
          <label>Name</label>
          <input className="input" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mailchimp switchers" required />
        </div>
        <div className="field">
          <label>What you sell</label>
          <input className="input" name="niche" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Email marketing tool for small startups" />
        </div>
        <div className="field">
          <label>Keywords to catch <span className="hint">(comma-separated)</span></label>
          <input className="input" name="include" value={include} onChange={(e) => setInclude(e.target.value)} placeholder="alternative to mailchimp, switching from, email tool recommendation" />
        </div>
        <div className="field">
          <label>Words to exclude <span className="hint">(comma-separated)</span></label>
          <input className="input" name="exclude" value={exclude} onChange={(e) => setExclude(e.target.value)} placeholder="free, community, sites like" />
        </div>
        <div className="field">
          <label>Minimum intent score <span className="hint">(1–10 — only keep leads at or above this)</span></label>
          <input className="input" type="number" name="min_score" min={1} max={10} value={minScore} onChange={(e) => setMinScore(parseInt(e.target.value, 10) || 5)} style={{ maxWidth: 120 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SubmitButton pendingText={editing ? "Saving…" : "Creating…"}>{editing ? "Save changes" : "Create niche"}</SubmitButton>
          {showCancel && <Link className="btn btn-ghost sm" href="/dashboard/setup">Cancel</Link>}
        </div>
      </form>
    </>
  );
}
