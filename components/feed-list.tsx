"use client";

import { useMemo, useState } from "react";
import { LeadCard, type Lead } from "@/components/lead-card";
import { Icon } from "@/components/icons";

type Filter = "all" | "new" | "hot" | "saved" | "contacted";
type Sort = "hot" | "new";

const SOURCE_LABEL: Record<string, string> = {
  hackernews: "Hacker News", lobsters: "Lobsters", stackexchange: "Stack Exchange", devto: "Dev.to", bluesky: "Bluesky",
};

function dateBucket(iso: string): "Today" | "This week" | "Earlier" {
  const d = new Date(iso).getTime();
  const now = Date.now();
  if (now - d < 86_400_000) return "Today";
  if (now - d < 7 * 86_400_000) return "This week";
  return "Earlier";
}

export function FeedList({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("hot");
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState("all");
  const [source, setSource] = useState("all");

  const niches = useMemo(
    () => [...new Set(leads.map((l) => l.niche).filter(Boolean) as string[])],
    [leads],
  );
  const sources = useMemo(
    () => [...new Set(leads.map((l) => l.source))],
    [leads],
  );

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    hot: leads.filter((l) => l.score >= 8).length,
    saved: leads.filter((l) => l.status === "saved").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
  };

  const query = q.trim().toLowerCase();
  const shown = leads
    .filter((l) => {
      if (filter === "new" && l.status !== "new") return false;
      if (filter === "hot" && l.score < 8) return false;
      if (filter === "saved" && l.status !== "saved") return false;
      if (filter === "contacted" && l.status !== "contacted") return false;
      if (niche !== "all" && l.niche !== niche) return false;
      if (source !== "all" && l.source !== source) return false;
      if (query) {
        const hay = `${l.title ?? ""} ${l.excerpt ?? ""} ${l.reason ?? ""} ${(l.labels ?? []).join(" ")} ${l.note ?? ""}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "hot") return b.score - a.score || +new Date(b.created_at) - +new Date(a.created_at);
      return +new Date(b.created_at) - +new Date(a.created_at);
    });

  const pills: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "hot", label: "Hot (8+)" },
    { key: "saved", label: "Saved" },
    { key: "contacted", label: "Contacted" },
  ];

  // Group by date only when sorting by newest.
  const grouped: { label: string; items: Lead[] }[] = [];
  if (sort === "new") {
    for (const l of shown) {
      const b = dateBucket(l.created_at);
      const last = grouped[grouped.length - 1];
      if (last && last.label === b) last.items.push(l);
      else grouped.push({ label: b, items: [l] });
    }
  }

  return (
    <>
      <div className="feedbar">
        <div className="filters">
          {pills.map((p) => (
            <button key={p.key} className={`pill ${filter === p.key ? "on" : ""}`} onClick={() => setFilter(p.key)}>
              {p.label} <span className="tab-nums" style={{ opacity: 0.6 }}>{counts[p.key]}</span>
            </button>
          ))}
        </div>
        <div className="searchbox">
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" aria-label="Search leads" />
        </div>
      </div>

      <div className="feedbar feedbar-2">
        <div className="seg" role="group" aria-label="Sort">
          <Icon name="sort" />
          <button className={sort === "hot" ? "on" : ""} onClick={() => setSort("hot")}>Hottest</button>
          <button className={sort === "new" ? "on" : ""} onClick={() => setSort("new")}>Newest</button>
        </div>
        {niches.length > 1 && (
          <select className="minisel" value={niche} onChange={(e) => setNiche(e.target.value)} aria-label="Filter by niche">
            <option value="all">All niches</option>
            {niches.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
        {sources.length > 1 && (
          <select className="minisel" value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source">
            <option value="all">All sources</option>
            {sources.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s] ?? s}</option>)}
          </select>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="empty"><p style={{ margin: 0 }}>{query ? `No leads match “${q}”.` : "No leads in this view."}</p></div>
      ) : sort === "new" ? (
        grouped.map((g) => (
          <div key={g.label}>
            <div className="group-h">{g.label} <span className="tab-nums">{g.items.length}</span></div>
            {g.items.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
          </div>
        ))
      ) : (
        shown.map((lead) => <LeadCard key={lead.id} lead={lead} />)
      )}
    </>
  );
}
