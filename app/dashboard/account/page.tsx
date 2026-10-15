import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PLAN_LABEL: Record<string, string> = { solo: "Solo — €9/mo", pro: "Pro — €19/mo" };
const STATUS_LABEL: Record<string, string> = {
  trialing: "Trial", active: "Active", past_due: "Payment due",
  canceled: "Canceled", unpaid: "Unpaid",
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
    ? new Date(profile.current_period_end).toLocaleDateString("en-GB")
    : null;

  return (
    <>
      <div className="phead"><h2>Account &amp; billing</h2></div>
      <p className="subt">Your details, payment and plan.</p>

      <div className="panel">
        <h3>Your details</h3>
        <p className="ph">The email on your account.</p>
        <div className="field">
          <label>Email</label>
          <input className="input" defaultValue={user?.email ?? ""} disabled />
        </div>
      </div>

      <div className="panel">
        <h3>Plan</h3>
        {hasSub ? (
          <>
            <p className="ph">Your subscription.</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", border: "1px solid var(--border)", borderRadius: 10, padding: 14, background: "var(--surface-2)" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{PLAN_LABEL[profile!.plan ?? ""] ?? "Subscription"}</div>
                <div style={{ fontSize: 13, color: "var(--faint)" }}>
                  Status: {STATUS_LABEL[profile!.subscription_status!] ?? profile!.subscription_status}
                  {periodEnd ? ` · renews ${periodEnd}` : ""}
                </div>
              </div>
              <form action="/api/stripe/portal" method="post">
                <button className="btn btn-ghost sm" type="submit">Manage subscription</button>
              </form>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 10 }}>
              From the portal you can change plan, update your card or cancel.
            </p>
          </>
        ) : (
          <>
            <p className="ph">Choose a plan to get started. Your first 7 days are free.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <form action="/api/stripe/checkout" method="post" style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 16, background: "var(--surface-2)" }}>
                <input type="hidden" name="plan" value="solo" />
                <div style={{ fontWeight: 600 }}>Solo</div>
                <div style={{ fontSize: 13, color: "var(--faint)", margin: "2px 0 12px" }}>€9/mo · 1 niche</div>
                <button className="btn btn-ghost sm" type="submit" style={{ width: "100%" }}>Choose Solo</button>
              </form>
              <form action="/api/stripe/checkout" method="post" style={{ border: "2px solid var(--ink)", borderRadius: 10, padding: 16, background: "var(--surface-2)" }}>
                <input type="hidden" name="plan" value="pro" />
                <div style={{ fontWeight: 600 }}>Pro</div>
                <div style={{ fontSize: 13, color: "var(--faint)", margin: "2px 0 12px" }}>€19/mo · unlimited</div>
                <button className="btn btn-primary sm" type="submit" style={{ width: "100%" }}>Choose Pro</button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
