import Stripe from "stripe";

// Client Stripe lato server, creato "pigro": si accende solo quando serve davvero
// (alla prima chiamata a runtime), non durante la compilazione. Cosi' il sito si
// pubblica anche prima di aver configurato le chiavi Stripe.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

// Proxy: qualsiasi uso di `stripe.xxx` crea il client al primo accesso reale.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe() as unknown as Record<string | symbol, unknown>;
    return client[prop];
  },
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
