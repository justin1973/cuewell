"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Icon } from "@/components/icons";
import { toggleWatch, deleteWatch } from "@/app/dashboard/actions";

export type Watch = {
  id: string;
  name: string;
  niche_description: string | null;
  include_keywords: string[] | null;
  exclude_keywords: string[] | null;
  min_score: number | null;
  active: boolean;
};

export function NicheCard({ watch }: { watch: Watch }) {
  const [pending, start] = useTransition();
  const include = watch.include_keywords ?? [];
  const exclude = watch.exclude_keywords ?? [];

  return (
    <div className="niche" style={pending ? { opacity: 0.5 } : undefined}>
      <div className="niche-top">
        <div style={{ minWidth: 0 }}>
          <div className="niche-name">
            {watch.name}
            <span className={`dot ${watch.active ? "live" : "paused"}`} />
            <span className="niche-state">{watch.active ? "Active" : "Paused"}</span>
          </div>
          {watch.niche_description && <div className="niche-desc">{watch.niche_description}</div>}
        </div>
        <div className="niche-score" title="Minimum intent score to keep a lead">
          <div className="v tab-nums">{watch.min_score ?? 5}+</div>
          <div className="k">min score</div>
        </div>
      </div>

      {include.length > 0 && (
        <div className="niche-kw">
          {include.map((k) => <span className="tag" key={k}>{k}</span>)}
        </div>
      )}
      {exclude.length > 0 && (
        <div className="niche-kw muted-kw">
          <span className="kw-label">excluding</span>
          {exclude.map((k) => <span className="tag off" key={k}>{k}</span>)}
        </div>
      )}

      <div className="niche-actions">
        <Link className="btn btn-ghost sm" href={`/dashboard/setup?edit=${watch.id}`}>
          <Icon name="tune" />Edit
        </Link>
        <button
          className="btn btn-ghost sm"
          onClick={() => start(() => toggleWatch(watch.id, !watch.active))}
        >
          <Icon name={watch.active ? "pause" : "play"} />{watch.active ? "Pause" : "Resume"}
        </button>
        <button
          className="btn btn-danger sm"
          onClick={() => {
            if (confirm(`Delete "${watch.name}"? This can't be undone.`)) {
              start(() => deleteWatch(watch.id));
            }
          }}
        >
          <Icon name="trash" />Delete
        </button>
      </div>
    </div>
  );
}
