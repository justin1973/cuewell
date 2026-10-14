-- ============================================================
--  Cuewell — campi abbonamento Stripe
--  Da eseguire UNA VOLTA nell'editor SQL di Supabase, DOPO lo
--  schema principale (schema.sql).
-- ============================================================

alter table public.profiles
  add column if not exists stripe_customer_id   text,
  add column if not exists subscription_status  text,     -- es. trialing, active, past_due, canceled
  add column if not exists plan                 text,     -- 'solo' | 'pro'
  add column if not exists current_period_end   timestamptz;

-- Indice per ritrovare il profilo dal cliente Stripe (usato dal webhook)
create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id);
