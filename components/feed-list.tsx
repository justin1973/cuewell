"use client";

import { useState } from "react";
import { LeadCard, type Lead } from "@/components/lead-card";
import { Icon } from "@/components/icons";

type Filter = "all" | "new" | "hot" | "saved";

export function FeedList({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    hot: leads.filter((l) => l.score >= 8).length,
    saved: leads.filter((l) => l.status === "saved").length,
  };

  const query = q.trim().toLowerCase();
  const shown = leads.filter((l) => {
    if (filter === "new" && l.status !== "new") return false;
    if (filter === "hot" && l.score < 8) return false;
    if (filter === "saved" && l.status !== "saved") return false;
    if (query) {
      const hay = `${l.title ?? ""} ${l.excerpt ?? ""} ${l.reason ?? ""} ${(l.labels ?? []).join(" ")}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const pills: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "hot", label: "Hot (8+)" },
    { key: "saved", label: "Saved" },
  ];

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
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search leads…"
            aria-label="Search leads"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          <p style={{ margin: 0 }}>{query ? `No leads match “${q}”.` : "No leads in this view."}</p>
        </div>
      ) : (
        shown.map((lead) => <LeadCard key={lead.id} lead={lead} />)
      )}
    </>
  );
}
