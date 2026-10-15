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

const STATUS_LABEL: Record<string, string> = {
  contacted: "Contacted", saved: "Saved", archived: "Archived",
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
      <div className="lactions">
        <a className="btn btn-primary sm" href={lead.url} target="_blank" rel="noopener noreferrer">
          Open post<Icon name="arrow-ur" />
        </a>
        <button className={`sq ${lead.status === "saved" ? "on" : ""}`} aria-label="Save for later" title="Save for later" onClick={() => mark(lead.status === "saved" ? "new" : "saved")}><Icon name="bookmark" /></button>
        <button className={`sq ${lead.status === "contacted" ? "on" : ""}`} aria-label="Mark as contacted" title="Mark as contacted" onClick={() => mark(lead.status === "contacted" ? "new" : "contacted")}><Icon name="check" /></button>
        <button className="sq" aria-label="Archive" title="Archive" onClick={() => mark("archived")}><Icon name="archive" /></button>
      </div>
    </div>
  );
}
