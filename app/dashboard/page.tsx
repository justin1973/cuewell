import { createClient } from "@/lib/supabase/server";
import { type Lead } from "@/components/lead-card";
import { FeedList } from "@/components/feed-list";
import { LeadsChart } from "@/components/leads-chart";
import { Icon } from "@/components/icons";
import { EmptyFeed } from "@/components/empty-feed";

export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = {
  hackernews: "Hacker News", lobsters: "Lobsters", stackexchange: "Stack Exchange", devto: "Dev.to", reddit: "Reddit", bluesky: "Bluesky",
};

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: leads }, { data: watches }] = await Promise.all([
    supabase
      .from("leads")
      .select("id, url, title, excerpt, score, reason, labels, status, source, created_at, note, watch_id")
      .not("status", "in", "(archived,irrelevant)")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("watches").select("id, name, last_run_at").eq("user_id", user!.id),
  ]);

  const watchName = new Map((watches ?? []).map((w) => [w.id, w.name as string]));
  const nicheCount = (watches ?? []).length;
  const lastChecked = (watches ?? [])
    .map((w) => w.last_run_at as string | null)
    .filter(Boolean)
    .sort()
    .pop() ?? null;
  const list = ((leads ?? []) as (Lead & { watch_id: string })[]).map((l) => ({
    ...l,
    niche: watchName.get(l.watch_id) ?? null,
  })) as Lead[];

  const now = Date.now();
  const today = list.filter((l) => now - new Date(l.created_at).getTime() < 86_400_000).length;
  const week = list.filter((l) => now - new Date(l.created_at).getTime() < 7 * 86_400_000).length;
  const hotWaiting = list.filter((l) => l.score >= 8 && l.status === "new").length;
  const contacted = list.filter((l) => l.status === "contacted").length;
  const saved = list.filter((l) => l.status === "saved").length;

  // Best source by volume (for the insight line).
  const srcCount = new Map<string, number>();
  list.forEach((l) => srcCount.set(l.source, (srcCount.get(l.source) ?? 0) + 1));
  const bestSource = [...srcCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  // 14-day chart buckets (oldest → newest).
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return d;
  });
  const chart = days.map((d) => {
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const n = list.filter((l) => {
      const t = new Date(l.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return { label: d.toLocaleDateString("en-GB", { day: "numeric" }), n };
  });

  return (
    <>
      <div className="phead">
        <h2>Opportunities</h2>
        {list.length > 0 && (
          <a className="btn btn-ghost sm" href="/api/leads/export"><Icon name="download" />Export CSV</a>
        )}
      </div>
      <p className="subt">Threads where someone is actively searching, ranked by intent.</p>

      {list.length > 0 && (
        <div className="insight">
          <span className="insight-strong">{hotWaiting} hot {hotWaiting === 1 ? "lead" : "leads"} waiting</span>
          <span className="dotsep">·</span>
          <span>{week} new this week</span>
          {bestSource && <><span className="dotsep">·</span><span>top source: {SOURCE_LABEL[bestSource] ?? bestSource}</span></>}
        </div>
      )}

      <div className="tiles" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="tile"><div className="k">New today</div><div className="v tab-nums">{today}</div></div>
        <div className="tile"><div className="k">Hot waiting</div><div className="v tab-nums" style={{ color: hotWaiting > 0 ? "var(--hot)" : undefined }}>{hotWaiting}</div></div>
        <div className="tile"><div className="k">Contacted</div><div className="v tab-nums">{contacted}</div></div>
        <div className="tile"><div className="k">Saved</div><div className="v tab-nums">{saved}</div></div>
      </div>

      {list.length === 0 ? (
        <EmptyFeed nicheCount={nicheCount} lastChecked={lastChecked} />
      ) : (
        <>
          <LeadsChart counts={chart} />
          <FeedList leads={list} />
        </>
      )}
    </>
  );
}
