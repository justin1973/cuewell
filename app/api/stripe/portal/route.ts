import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

// Apre il portale clienti Stripe: da lì l'utente cambia piano, aggiorna la carta o disdice.
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url), { status: 302 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/dashboard/account", request.url), { status: 302 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/dashboard/account`,
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
