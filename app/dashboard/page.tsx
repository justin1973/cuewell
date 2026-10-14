import { createClient } from "@/lib/supabase/server";
import { LeadCard, type Lead } from "@/components/lead-card";
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

  // L'utente ha configurato almeno una watch?
  const { count: watchCount } = await supabase
    .from("watches").select("id", { count: "exact", head: true }).eq("user_id", user!.id);

  return (
    <>
      <div className="phead"><h2>Feed opportunità</h2></div>
      <p className="subt">I thread dove qualcuno sta cercando, ordinati per intento.</p>

      <div className="tiles">
        <div className="tile"><div className="k">Nuovi oggi</div><div className="v tab-nums">{today}</div></div>
        <div className="tile"><div className="k">Totale attivi</div><div className="v tab-nums">{list.length}</div></div>
        <div className="tile"><div className="k">Salvati</div><div className="v tab-nums">{saved}</div></div>
      </div>

      {!watchCount ? (
        <div className="empty">
          <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Imposta cosa cercare</p>
          <p style={{ marginBottom: 16 }}>Non hai ancora configurato la tua nicchia e le parole chiave. Senza, il motore non sa cosa cercare per te.</p>
          <Link className="btn btn-primary sm" href="/dashboard/setup">Vai al setup</Link>
        </div>
      ) : list.length === 0 ? (
        <div className="empty">
          <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Ancora nessun lead</p>
          <p>Il motore sta monitorando le tue parole chiave. I primi lead appariranno qui appena qualcuno di rilevante scrive.</p>
        </div>
      ) : (
        list.map((lead) => <LeadCard key={lead.id} lead={lead} />)
      )}
    </>
  );
}
