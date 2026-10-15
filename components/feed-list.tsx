"use client";

import { useState } from "react";
import { LeadCard, type Lead } from "@/components/lead-card";

type Filter = "all" | "new" | "hot" | "saved";

export function FeedList({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    hot: leads.filter((l) => l.score >= 8).length,
    saved: leads.filter((l) => l.status === "saved").length,
  };

  const shown = leads.filter((l) => {
    if (filter === "new") return l.status === "new";
    if (filter === "hot") return l.score >= 8;
    if (filter === "saved") return l.status === "saved";
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
      <div className="filters">
        {pills.map((p) => (
          <button
            key={p.key}
            className={`pill ${filter === p.key ? "on" : ""}`}
            onClick={() => setFilter(p.key)}
          >
            {p.label} <span className="tab-nums" style={{ opacity: 0.6 }}>{counts[p.key]}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          <p style={{ margin: 0 }}>No leads in this view.</p>
        </div>
      ) : (
        shown.map((lead) => <LeadCard key={lead.id} lead={lead} />)
      )}
    </>
  );
}
