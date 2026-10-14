import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, planForPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

// Stripe chiama questa route a ogni evento (pagamento, rinnovo, disdetta).
// Aggiorna lo stato dell'abbonamento nel database. Verifica la firma per sicurezza.
export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, secret!);
  } catch (err) {
    return NextResponse.json({ error: `Firma non valida: ${(err as Error).message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  async function syncSubscription(sub: Stripe.Subscription) {
    const customerId = sub.customer as string;
    const priceId = sub.items.data[0]?.price?.id;
    await admin.from("profiles").update({
      subscription_status: sub.status,
      plan: planForPriceId(priceId),
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    }).eq("stripe_customer_id", customerId);
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(event.data.object as Stripe.Subscription);
      break;
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await syncSubscription(sub);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
