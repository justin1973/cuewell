import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminUserRow, type AdminUser } from "@/components/admin-user-row";
import { AdminCreateUser } from "@/components/admin-create-user";
import { LeadsChart } from "@/components/leads-chart";
import { getGaStats } from "@/lib/ga";
import { Icon } from "@/components/icons";
import "../dashboard/dashboard.css";

export const dynamic = "force-dynamic";

const PRICE: Record<string, number> = { solo: 9, pro: 19 };

const CREATED_MSG: Record<string, { cls: string; text: string }> = {
  ok: { cls: "", text: "User created." },
  invalid: { cls: "warn", text: "Enter a valid email and a password of at least 8 characters." },
  error: { cls: "warn", text: "Couldn't create the user — the email may already exist." },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { created?: string };
}) {
  const supabase = createClient();
  const { data: { user: me } } = await supabase.auth.getUser();
  if (!isAdmin(me?.email)) redirect("/dashboard");

  const admin = createAdminClient();
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [
    { data: profiles },
    authList,
    { data: leadUserIds },
    { data: watchUserIds },
    { data: lastRun },
    { count: leads24 },
    { count: leads7 },
  ] = await Promise.all([
    admin.from("profiles").select("id, email, plan, subscription_status, suspended, created_at"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("leads").select("user_id"),
    admin.from("watches").select("user_id, active"),
    admin.from("watches").select("last_run_at").order("last_run_at", { ascending: false }).limit(1),
    admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
    admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
  ]);

  // Tally per-user leads & active watches.
  const leadCount = new Map<string, number>();
  (leadUserIds ?? []).forEach((r) => leadCount.set(r.user_id, (leadCount.get(r.user_id) ?? 0) + 1));
  const watchCount = new Map<string, number>();
  let activeWatches = 0;
  (watchUserIds ?? []).forEach((r) => {
    watchCount.set(r.user_id, (watchCount.get(r.user_id) ?? 0) + 1);
    if (r.active) activeWatches++;
  });

  const authById = new Map((authList.data?.users ?? []).map((u) => [u.id, u]));
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Union of ids from both sources, so no one is missed.
  const allIds = new Set<string>([...profileById.keys(), ...authById.keys()]);
  const users: AdminUser[] = [...allIds].map((id) => {
    const p = profileById.get(id);
    const a = authById.get(id);
    return {
      id,
      email: p?.email ?? a?.email ?? "(unknown)",
      plan: p?.plan ?? null,
      status: p?.subscription_status ?? null,
      suspended: !!p?.suspended,
      leads: leadCount.get(id) ?? 0,
      watches: watchCount.get(id) ?? 0,
      createdAt: a?.created_at ?? p?.created_at ?? null,
      lastSignIn: a?.last_sign_in_at ?? null,
      isSelf: id === me!.id,
    };
  }).sort((x, y) => (y.createdAt ?? "").localeCompare(x.createdAt ?? ""));

  // Metrics.
  const total = users.length;
  const paying = users.filter((u) => u.status === "active" || u.status === "past_due").length;
  const trialing = users.filter((u) => u.status === "trialing").length;
  const suspended = users.filter((u) => u.suspended).length;
  const newWeek = users.filter((u) => u.createdAt && u.createdAt >= weekAgo).length;
  const mrr = users
    .filter((u) => u.status === "active" || u.status === "past_due")
    .reduce((s, u) => s + (PRICE[u.plan ?? ""] ?? 0), 0);

  const last = lastRun?.[0]?.last_run_at as string | undefined;
  const engineFresh = last ? Date.now() - new Date(last).getTime() < 2 * 3_600_000 : false;
  const createdMsg = searchParams.created ? CREATED_MSG[searchParams.created] : undefined;

  // Analytics (derived from what Supabase gives us: signup dates + last sign-in).
  const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const active24 = users.filter((u) => u.lastSignIn && u.lastSignIn >= dayAgo).length;
  const active7 = users.filter((u) => u.lastSignIn && u.lastSignIn >= weekAgo).length;
  const active30 = users.filter((u) => u.lastSignIn && u.lastSignIn >= monthAgo).length;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return d;
  });
  const signupChart = days.map((d) => {
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const n = users.filter((u) => u.createdAt && new Date(u.createdAt) >= d && new Date(u.createdAt) < next).length;
    return { label: d.toLocaleDateString("en-GB", { day: "numeric" }), n };
  });

  // Live web analytics from Google Analytics (null if not configured yet).
  const ga = await getGaStats();

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "22px 20px" }}>
      <div className="phead"><h2>Admin console</h2></div>
      <p className="subt">The business at a glance — from visitors to paying customers.</p>

      {/* GROWTH — the funnel */}
      <div className="admin-section">
        <h3><Icon name="activity" />Growth</h3>
        <div className="tiles funnel" style={{ gridTemplateColumns: "repeat(5,1fr)", marginBottom: 14 }}>
          <div className="tile"><div className="k">Visitors · 30d</div><div className="v tab-nums">{ga ? ga.users30 : "—"}</div></div>
          <div className="tile"><div className="k">Signups</div><div className="v tab-nums">{total}</div></div>
          <div className="tile"><div className="k">Active · 30d</div><div className="v tab-nums">{active30}</div></div>
          <div className="tile"><div className="k">Paying</div><div className="v tab-nums">{paying}</div></div>
          <div className="tile"><div className="k">MRR</div><div className="v tab-nums" style={{ color: mrr > 0 ? "var(--ok)" : undefined }}>€{mrr}</div></div>
        </div>

        <div className="chart-grid">
          {ga && <LeadsChart counts={ga.chart} title="Page views — last 14 days" unit="view" />}
          <LeadsChart counts={signupChart} title="New signups — last 14 days" unit="signup" />
        </div>

        {ga && ga.topPages.length > 0 && (
          <div className="panel" style={{ maxWidth: "none", marginTop: 12 }}>
            <h3 style={{ fontSize: 14 }}>Top pages <span className="hint">· 7 days</span></h3>
            {ga.topPages.map((p) => (
              <div className="inv" key={p.path}>
                <span className="inv-date" style={{ fontWeight: 500 }}>{p.path}</span>
                <span className="inv-amt tab-nums">{p.views}</span>
              </div>
            ))}
          </div>
        )}
        {!ga && (
          <p className="hint" style={{ marginTop: 10 }}>
            Visitor numbers are blank until Google Analytics is connected (add <code>GA_PROPERTY_ID</code>, <code>GA_CLIENT_EMAIL</code>, <code>GA_PRIVATE_KEY</code> on Vercel — see the setup guide).
          </p>
        )}
        <p className="hint" style={{ marginTop: 10 }}>
          Active users: {active24} today · {active7} this week · {active30} this month. New signups (7d): {newWeek}. Trials: {trialing}.
        </p>
      </div>

      {/* SYSTEM HEALTH */}
      <div className="admin-section">
        <h3><Icon name="activity" />System health</h3>
        <div className="panel" style={{ maxWidth: "none", marginBottom: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 16 }}>
            <div>
              <div className="health">
                <span className={`dot ${engineFresh ? "live" : "paused"}`} />
                {engineFresh ? "Engine healthy" : "Engine idle / check cron"}
              </div>
              <div className="hint" style={{ marginTop: 4 }}>
                Last run {last ? new Date(last).toLocaleString("en-GB") : "never"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Active watches</div>
              <div style={{ fontWeight: 600 }} className="tab-nums">{activeWatches}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Leads (24h / 7d)</div>
              <div style={{ fontWeight: 600 }} className="tab-nums">{leads24 ?? 0} / {leads7 ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Suspended</div>
              <div style={{ fontWeight: 600 }} className="tab-nums">{suspended}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="admin-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0 }}><Icon name="users" />Users <span className="hint">({total})</span></h3>
          <AdminCreateUser />
        </div>

        {createdMsg && (
          <div className={`savebar ${createdMsg.cls}`} style={{ maxWidth: "none" }}>
            <Icon name={createdMsg.cls === "warn" ? "alert" : "check"} /> {createdMsg.text}
          </div>
        )}

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Niches</th>
                <th>Leads</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => <AdminUserRow key={u.id} u={u} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
