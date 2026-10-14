import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import "../dashboard/dashboard.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) redirect("/dashboard");

  const admin = createAdminClient();
  const [{ count: userCount }, { count: watchCount }, { data: recentLeads }, { count: leadsToday }] =
    await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin.from("watches").select("id", { count: "exact", head: true }).eq("active", true),
      admin.from("leads").select("id, created_at").order("created_at", { ascending: false }).limit(1),
      admin.from("leads").select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 86_400_000).toISOString()),
    ]);

  const lastLead = recentLeads?.[0]?.created_at as string | undefined;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "22px 20px" }}>
      <div className="phead"><h2>Panoramica admin</h2></div>
      <p className="subt">Il polso di Cuewell in un colpo d&apos;occhio.</p>

      <div className="tiles">
        <div className="tile"><div className="k">Utenti registrati</div><div className="v tab-nums">{userCount ?? 0}</div></div>
        <div className="tile"><div className="k">Watch attive</div><div className="v tab-nums">{watchCount ?? 0}</div></div>
        <div className="tile"><div className="k">Lead (ultime 24h)</div><div className="v tab-nums">{leadsToday ?? 0}</div></div>
      </div>

      <div className="panel" style={{ maxWidth: "none" }}>
        <h3>Stato motore</h3>
        <p className="ph" style={{ margin: 0 }}>
          {lastLead
            ? `Ultimo lead prodotto: ${new Date(lastLead).toLocaleString("it-IT")}.`
            : "Nessun lead ancora prodotto. Verifica che il motore sia schedulato e che esista almeno una watch attiva."}
        </p>
      </div>
    </div>
  );
}
