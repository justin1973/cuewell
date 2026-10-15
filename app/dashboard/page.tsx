import { createClient } from "@/lib/supabase/server";
import { type Lead } from "@/components/lead-card";
import { FeedList } from "@/components/feed-list";
import { LeadsChart } from "@/components/leads-chart";
import { Icon } from "@/components/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: leads } = await supabase
    .from("leads")
    .select("id, url, title, excerpt, score, reason, labels, status, source, created_at")
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (leads ?? []) as Lead[];
  const today = list.filter((l) => Date.now() - new Date(l.created_at).getTime() < 86_400_000).length;
  const saved = list.filter((l) => l.status === "saved").length;

  // 14-day buckets for the chart (oldest → newest).
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    return d;
  });
  const chart = days.map((d) => {
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const n = list.filter((l) => {
      const t = new Date(l.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return { label: d.toLocaleDateString("en-GB", { day: "numeric" }), n };
  });

  const { count: watchCount } = await supabase
    .from("watches").select("id", { count: "exact", head: true }).eq("user_id", user!.id);

  return (
    <>
      <div className="phead">
        <h2>Opportunities</h2>
        {list.length > 0 && (
          <a className="btn btn-ghost sm" href="/api/leads/export"><Icon name="download" />Export CSV</a>
        )}
      </div>
      <p className="subt">Threads where someone is actively searching, ranked by intent.</p>

      <div className="tiles">
        <div className="tile"><div className="k">New today</div><div className="v tab-nums">{today}</div></div>
        <div className="tile"><div className="k">Active total</div><div className="v tab-nums">{list.length}</div></div>
        <div className="tile"><div className="k">Saved</div><div className="v tab-nums">{saved}</div></div>
      </div>

      {!watchCount ? (
        <div className="empty">
          <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Tell Cuewell what to look for</p>
          <p style={{ marginBottom: 16 }}>You haven&apos;t set up a niche yet. Without one, the engine doesn&apos;t know what to search for.</p>
          <Link className="btn btn-primary sm" href="/dashboard/setup">Go to setup</Link>
        </div>
      ) : list.length === 0 ? (
        <div className="empty">
          <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>No leads yet</p>
          <p>Cuewell checks your sources every hour. The first leads usually appear within a day — you can see the last check time on each niche in Setup.</p>
        </div>
      ) : (
        <>
          <LeadsChart counts={chart} />
          <FeedList leads={list} />
        </>
      )}
    </>
  );
}
