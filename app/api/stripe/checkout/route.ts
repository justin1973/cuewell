import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, priceIdForPlan } from "@/lib/stripe";

// Avvia il checkout Stripe per il piano scelto e reindirizza alla pagina di pagamento.
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url), { status: 302 });

  const form = await request.formData();
  const plan = String(form.get("plan") ?? "pro");
  const priceId = priceIdForPlan(plan);
  if (!priceId) return NextResponse.json({ error: "Piano non valido" }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  // Riusa il cliente Stripe esistente, o creane uno nuovo
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();

  let customerId = profile?.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${appUrl}/dashboard/account?checkout=success`,
    cancel_url: `${appUrl}/dashboard/account?checkout=cancel`,
    allow_promotion_codes: true,
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
