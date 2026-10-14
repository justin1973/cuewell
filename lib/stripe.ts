import Stripe from "stripe";

// Client Stripe lato server. La chiave segreta sta solo nelle env del server.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

// Mappa piano -> price id (creati nel tuo account Stripe).
export function priceIdForPlan(plan: string): string | null {
  if (plan === "solo") return process.env.STRIPE_PRICE_SOLO ?? null;
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO ?? null;
  return null;
}

export function planForPriceId(priceId: string | undefined | null): string | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_SOLO) return "solo";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return null;
}
