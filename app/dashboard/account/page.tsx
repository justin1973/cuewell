import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PLAN_LABEL: Record<string, string> = { solo: "Solo — €9/mese", pro: "Pro — €19/mese" };
const STATUS_LABEL: Record<string, string> = {
  trialing: "In prova", active: "Attivo", past_due: "Pagamento in sospeso",
  canceled: "Disdetto", unpaid: "Non pagato",
};

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status, plan, current_period_end, stripe_customer_id")
    .eq("id", user!.id)
    .maybeSingle();

  const hasSub = !!profile?.subscription_status && profile.subscription_status !== "canceled";
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString("it-IT")
    : null;

  return (
    <>
      <div className="phead"><h2>Account &amp; abbonamento</h2></div>
      <p className="subt">Dati personali, pagamento e piano.</p>

      <div className="panel">
        <h3>Dati personali</h3>
        <p className="ph">L&apos;email del tuo account.</p>
        <div className="field">
          <label>Email</label>
          <input className="input" defaultValue={user?.email ?? ""} disabled />
        </div>
      </div>

      <div className="panel">
        <h3>Piano</h3>
        {hasSub ? (
          <>
            <p className="ph">Il tuo abbonamento.</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", border: "1px solid var(--border)", borderRadius: 10, padding: 14, background: "var(--surface-2)" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{PLAN_LABEL[profile!.plan ?? ""] ?? "Abbonamento"}</div>
                <div style={{ fontSize: 13, color: "var(--faint)" }}>
                  Stato: {STATUS_LABEL[profile!.subscription_status!] ?? profile!.subscription_status}
                  {periodEnd ? ` · rinnovo il ${periodEnd}` : ""}
                </div>
              </div>
              <form action="/api/stripe/portal" method="post">
                <button className="btn btn-ghost sm" type="submit">Gestisci abbonamento</button>
              </form>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 10 }}>
              Dal portale puoi cambiare piano, aggiornare la carta o disdire.
            </p>
          </>
        ) : (
          <>
            <p className="ph">Scegli un piano per iniziare. I primi 7 giorni sono gratuiti.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <form action="/api/stripe/checkout" method="post" style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 16, background: "var(--surface-2)" }}>
                <input type="hidden" name="plan" value="solo" />
                <div style={{ fontWeight: 600 }}>Solo</div>
                <div style={{ fontSize: 13, color: "var(--faint)", margin: "2px 0 12px" }}>€9/mese · 1 nicchia</div>
                <button className="btn btn-ghost sm" type="submit" style={{ width: "100%" }}>Scegli Solo</button>
              </form>
              <form action="/api/stripe/checkout" method="post" style={{ border: "2px solid var(--ink)", borderRadius: 10, padding: 16, background: "var(--surface-2)" }}>
                <input type="hidden" name="plan" value="pro" />
                <div style={{ fontWeight: 600 }}>Pro</div>
                <div style={{ fontSize: 13, color: "var(--faint)", margin: "2px 0 12px" }}>€19/mese · illimitate</div>
                <button className="btn btn-primary sm" type="submit" style={{ width: "100%" }}>Scegli Pro</button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
