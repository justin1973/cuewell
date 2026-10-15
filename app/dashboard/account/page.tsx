import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { updateEmail } from "../actions";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

const PLAN_LABEL: Record<string, string> = { solo: "Solo", pro: "Pro" };
const PLAN_PRICE: Record<string, string> = { solo: "€9/mo · 1 niche", pro: "€19/mo · unlimited niches" };
const STATUS_LABEL: Record<string, string> = {
  trialing: "Trial", active: "Active", past_due: "Payment due",
  canceled: "Canceled", unpaid: "Unpaid",
};
const EMAIL_MSG: Record<string, { cls: string; icon: string; text: string }> = {
  sent: { cls: "", icon: "check", text: "Check your new inbox — we sent a link to confirm the change." },
  invalid: { cls: "warn", icon: "alert", text: "That doesn't look like a valid email." },
  error: { cls: "warn", icon: "alert", text: "Couldn't update the email. Try again in a moment." },
};

type Invoice = { id: string; created: number; amount: number; currency: string; status: string; url: string | null };

async function recentInvoices(customerId: string | null): Promise<Invoice[]> {
  if (!customerId) return [];
  try {
    const res = await stripe.invoices.list({ customer: customerId, limit: 3 });
    return res.data.map((i) => ({
      id: i.id,
      created: i.created,
      amount: (i.amount_paid || i.amount_due) / 100,
      currency: (i.currency || "eur").toUpperCase(),
      status: i.status ?? "open",
      url: i.hosted_invoice_url ?? null,
    }));
  } catch {
    return [];
  }
}

function invBadge(status: string) {
  if (status === "paid") return { cls: "ok", label: "Paid" };
  if (status === "open" || status === "draft") return { cls: "wait", label: "Pending" };
  if (status === "uncollectible" || status === "void") return { cls: "fail", label: "Failed" };
  return { cls: "wait", label: status };
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { email?: string; checkout?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status, plan, current_period_end, stripe_customer_id")
    .eq("id", user!.id)
    .maybeSingle();

  const hasSub = !!profile?.subscription_status && profile.subscription_status !== "canceled";
  const currentPlan = profile?.plan ?? null;
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString("en-GB")
    : null;
  const invoices = await recentInvoices(profile?.stripe_customer_id ?? null);
  const emailMsg = searchParams.email ? EMAIL_MSG[searchParams.email] : undefined;

  return (
    <>
      <div className="phead"><h2>Account &amp; billing</h2></div>
      <p className="subt">Your details, plan and payment history.</p>

      {searchParams.checkout === "success" && (
        <div className="savebar"><Icon name="check" /> You&apos;re all set — your subscription is active.</div>
      )}

      {/* Email */}
      <div className="panel">
        <h3>Email</h3>
        <p className="ph">Used to sign in and to receive your lead digests. Changing it sends a confirmation link to the new address.</p>
        {emailMsg && (
          <div className={`savebar ${emailMsg.cls}`} style={{ maxWidth: "none" }}>
            <Icon name={emailMsg.icon} /> {emailMsg.text}
          </div>
        )}
        <form action={updateEmail} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="field" style={{ margin: 0, flex: 1, minWidth: 220 }}>
            <label>Email address</label>
            <input className="input" type="email" name="email" defaultValue={user?.email ?? ""} required />
          </div>
          <button className="btn btn-ghost sm" type="submit">Update email</button>
        </form>
      </div>

      {/* Plan */}
      <div className="panel">
        <h3>Plan</h3>
        {hasSub ? (
          <>
            <p className="ph">Manage your subscription from the secure Stripe portal.</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", border: "1px solid var(--border)", borderRadius: 10, padding: 14, background: "var(--surface-2)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`plan-pill ${profile!.plan === "pro" ? "pro" : ""}`}>{PLAN_LABEL[profile!.plan ?? ""] ?? "Plan"}</span>
                  <span className="badge wait" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)" }}>
                    {STATUS_LABEL[profile!.subscription_status!] ?? profile!.subscription_status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--faint)", marginTop: 6 }}>
                  {PLAN_PRICE[profile!.plan ?? ""] ?? ""}{periodEnd ? ` · renews ${periodEnd}` : ""}
                </div>
              </div>
              <form action="/api/stripe/portal" method="post">
                <button className="btn btn-ghost sm" type="submit"><Icon name="settings" />Manage plan</button>
              </form>
            </div>
            <p className="hint" style={{ marginTop: 10 }}>
              From the portal you can switch between Solo and Pro, update your card or cancel.
            </p>
          </>
        ) : (
          <>
            <p className="ph">
              {currentPlan
                ? `You're on the ${PLAN_LABEL[currentPlan] ?? currentPlan} plan. Start a subscription below, or switch plan.`
                : "Choose a plan to get started. Your first 7 days are free."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {([
                { key: "solo", name: "Solo", price: "€9/mo · 1 niche", primary: false },
                { key: "pro", name: "Pro", price: "€19/mo · unlimited", primary: true },
              ] as const).map((p) => {
                const isCurrent = currentPlan === p.key;
                return (
                  <div
                    key={p.key}
                    style={{
                      border: isCurrent ? "2px solid var(--ok)" : p.primary ? "2px solid var(--ink)" : "1px solid var(--border)",
                      borderRadius: 10, padding: 16, background: "var(--surface-2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                      {isCurrent && <span className="badge ok">Current</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--faint)", margin: "2px 0 12px" }}>{p.price}</div>
                    {isCurrent ? (
                      <button className="btn btn-ghost sm" type="button" disabled style={{ width: "100%", opacity: 0.6, cursor: "default" }}>
                        Current plan
                      </button>
                    ) : (
                      <form action="/api/stripe/checkout" method="post">
                        <input type="hidden" name="plan" value={p.key} />
                        <button className={`btn ${p.primary ? "btn-primary" : "btn-ghost"} sm`} type="submit" style={{ width: "100%" }}>
                          {currentPlan ? `Switch to ${p.name}` : `Choose ${p.name}`}
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
            {currentPlan && (
              <p className="hint" style={{ marginTop: 10 }}>
                You already have {PLAN_LABEL[currentPlan] ?? currentPlan} access. Starting a subscription adds billing through Stripe.
              </p>
            )}
          </>
        )}
      </div>

      {/* Billing history */}
      {hasSub && (
        <div className="panel">
          <h3>Billing history</h3>
          <p className="ph">Your most recent charges.</p>
          {invoices.length === 0 ? (
            <p className="hint">No invoices yet — the first one appears after your trial ends.</p>
          ) : (
            <>
              {invoices.map((inv) => {
                const b = invBadge(inv.status);
                return (
                  <div className="inv" key={inv.id}>
                    <div className="inv-l">
                      <span className="inv-date">{new Date(inv.created * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      <span className="inv-sub">Cuewell subscription</span>
                    </div>
                    <div className="inv-r">
                      <span className="inv-amt tab-nums">{inv.currency === "EUR" ? "€" : inv.currency + " "}{inv.amount.toFixed(2)}</span>
                      <span className={`badge ${b.cls}`}>{b.label}</span>
                      {inv.url && <a className="linkish" href={inv.url} target="_blank" rel="noopener noreferrer">Receipt</a>}
                    </div>
                  </div>
                );
              })}
              <form action="/api/stripe/portal" method="post" style={{ marginTop: 12 }}>
                <button className="linkish" type="submit">View all invoices →</button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
