"use client";

import { Icon } from "@/components/icons";
import { setLeadStatus } from "@/app/dashboard/actions";
import { useTransition } from "react";

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
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "poco fa";
  if (h < 24) return `${h} ore fa`;
  return `${Math.floor(h / 24)} giorni fa`;
}

export function LeadCard({ lead }: { lead: Lead }) {
  const [pending, start] = useTransition();
  const band = lead.score >= 8 ? "hot" : "warm";

  function mark(status: string) {
    start(() => setLeadStatus(lead.id, status));
  }

  return (
    <div className="lead" style={pending ? { opacity: 0.5 } : undefined}>
      <div className="top">
        <div className="lmeta">
          <span className="chip-src"><Icon name="msg" />{lead.source === "hackernews" ? "Hacker News" : lead.source}</span>
          <span>{timeAgo(lead.created_at)}</span>
          {lead.status !== "new" && <span className="tag">{lead.status}</span>}
        </div>
        <div className={`score ${band}`}>
          <div className="v tab-nums">{lead.score}</div>
          <div className="k">intento</div>
        </div>
      </div>
      {lead.title && <div className="ltitle">{lead.title}</div>}
      {lead.excerpt && <p className="quote">{lead.excerpt}</p>}
      {lead.labels?.length > 0 && (
        <div className="labels">{lead.labels.map((l) => <span className="tag" key={l}>{l}</span>)}</div>
      )}
      {lead.reason && <p className="reason">{lead.reason}</p>}
      <div className="lactions">
        <a className="btn btn-primary sm" href={lead.url} target="_blank" rel="noopener noreferrer">
          Apri il post<Icon name="arrow-ur" />
        </a>
        <button className={`sq ${lead.status === "saved" ? "on" : ""}`} aria-label="Salva" onClick={() => mark(lead.status === "saved" ? "new" : "saved")}><Icon name="bookmark" /></button>
        <button className={`sq ${lead.status === "contacted" ? "on" : ""}`} aria-label="Segna come contattato" onClick={() => mark(lead.status === "contacted" ? "new" : "contacted")}><Icon name="check" /></button>
        <button className="sq" aria-label="Archivia" onClick={() => mark("archived")}><Icon name="archive" /></button>
      </div>
    </div>
  );
}
