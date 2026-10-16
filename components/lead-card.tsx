"use client";

import { Icon } from "@/components/icons";
import { setLeadStatus, setLeadNote } from "@/app/dashboard/actions";
import { useState, useTransition } from "react";

export type Lead = {
  id: string;
  url: string;
  title: string | null;
  excerpt: string | null;
  score: number;
  reason: string | null;
  labels: string[];
  status: string;
  source: string;
  created_at: string;
  note?: string | null;
  niche?: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  contacted: "Contacted", saved: "Saved", archived: "Archived",
};

const SOURCE_LABEL: Record<string, string> = {
  hackernews: "Hacker News", lobsters: "Lobsters", stackexchange: "Stack Exchange",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h === 1) return "1 hour ago";
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

export function LeadCard({ lead }: { lead: Lead }) {
  const [pending, start] = useTransition();
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(lead.note ?? "");
  const band = lead.score >= 8 ? "hot" : "warm";

  function mark(status: string) {
    start(() => setLeadStatus(lead.id, status));
  }
  function saveNote() {
    start(() => setLeadNote(lead.id, noteDraft));
    setEditingNote(false);
  }

  return (
    <div className="lead" style={pending ? { opacity: 0.5 } : undefined}>
      <div className="top">
        <div className="lmeta">
          <span className="chip-src"><Icon name="msg" />{SOURCE_LABEL[lead.source] ?? lead.source}</span>
          {lead.niche && <span className="tag">{lead.niche}</span>}
          <span>{timeAgo(lead.created_at)}</span>
          {lead.status !== "new" && STATUS_LABEL[lead.status] && <span className="tag">{STATUS_LABEL[lead.status]}</span>}
        </div>
        <div className={`score ${band}`}>
          <div className="v tab-nums">{lead.score}</div>
          <div className="k">intent</div>
        </div>
      </div>
      {lead.title && <div className="ltitle">{lead.title}</div>}
      {lead.excerpt && <p className="quote">{lead.excerpt}</p>}
      {lead.labels?.length > 0 && (
        <div className="labels">{lead.labels.map((l) => <span className="tag" key={l}>{l}</span>)}</div>
      )}
      {lead.reason && <p className="reason">{lead.reason}</p>}

      {/* Private note */}
      {editingNote ? (
        <div className="note-edit">
          <textarea
            className="input"
            rows={2}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="e.g. emailed on 16/10, waiting for reply"
            autoFocus
          />
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button className="btn btn-primary sm" onClick={saveNote}>Save note</button>
            <button className="btn btn-ghost sm" onClick={() => { setNoteDraft(lead.note ?? ""); setEditingNote(false); }}>Cancel</button>
          </div>
        </div>
      ) : lead.note ? (
        <div className="note-show" onClick={() => setEditingNote(true)} title="Click to edit">
          <Icon name="edit" /><span>{lead.note}</span>
        </div>
      ) : null}

      <div className="lactions">
        <a className="btn btn-primary sm" href={lead.url} target="_blank" rel="noopener noreferrer">
          Open post<Icon name="arrow-ur" />
        </a>
        <button className={`sq ${lead.status === "saved" ? "on" : ""}`} aria-label="Save for later" title="Save for later" onClick={() => mark(lead.status === "saved" ? "new" : "saved")}><Icon name="bookmark" /></button>
        <button className={`sq ${lead.status === "contacted" ? "on" : ""}`} aria-label="Mark as contacted" title="Mark as contacted" onClick={() => mark(lead.status === "contacted" ? "new" : "contacted")}><Icon name="check" /></button>
        {!lead.note && !editingNote && (
          <button className="sq" aria-label="Add note" title="Add a private note" onClick={() => setEditingNote(true)}><Icon name="edit" /></button>
        )}
        <button className="sq" aria-label="Archive" title="Archive" onClick={() => mark("archived")}><Icon name="archive" /></button>
      </div>
    </div>
  );
}
