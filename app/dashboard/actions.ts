"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// How many niches a plan allows. Solo / trial / no plan = 1. Pro = unlimited.
function nicheLimit(plan: string | null | undefined): number {
  return plan === "pro" ? Infinity : 1;
}

function parseList(v: FormDataEntryValue | null): string[] {
  return String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

function parseScore(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v ?? "5"), 10);
  if (Number.isNaN(n)) return 5;
  return Math.min(10, Math.max(1, n));
}

// --- Niche wizard: AI drafts a niche config from a plain-language description ---
const WIZARD_FREE_LIMIT = 3; // free generations for non-Pro users

export type NicheSuggestion = {
  name: string;
  niche_description: string;
  include_keywords: string[];
  exclude_keywords: string[];
  min_score: number;
};

export async function suggestNiche(description: string): Promise<{
  ok: boolean; error?: string; remaining?: number | null; suggestion?: NicheSuggestion;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  const desc = (description ?? "").trim();
  if (desc.length < 3) return { ok: false, error: "Describe what you sell first." };

  const admin = createAdminClient();
  const { data: prof } = await admin
    .from("profiles").select("plan, niche_wizard_uses").eq("id", user.id).maybeSingle();
  const isPro = prof?.plan === "pro";
  const uses = prof?.niche_wizard_uses ?? 0;
  if (!isPro && uses >= WIZARD_FREE_LIMIT) {
    return { ok: false, error: "You've used all your free suggestions. Upgrade to Pro for unlimited.", remaining: 0 };
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) return { ok: false, error: "The niche wizard isn't configured yet." };

  const prompt = `You configure an intent-based lead-generation monitor. The user sells either a product or their own services/skills; produce settings to catch public posts (on Hacker News, Lobsters, Stack Exchange, Dev.to and Bluesky) where someone is ACTIVELY looking to buy a product like theirs, OR to hire someone for the kind of work they do.

User's description: "${desc}"

Return ONLY a JSON object:
{
  "name": "<short label, 2-5 words>",
  "niche_description": "<one or two sentences: what they sell and what counts as a lead>",
  "include_keywords": ["<6-10 lowercase phrases people actually write. For a PRODUCT: 'alternative to <competitor>', 'looking for', 'any recommendations', 'switching from'. For a SERVICE: 'looking for a <role>', 'need help building', 'anyone know a good <role>', 'hiring a <role>'. Specific to this niche>"],
  "exclude_keywords": ["<2-5 lowercase noise words that would cause false positives for THIS niche — decide based on whether they sell a product or a service (do NOT exclude hiring words for a freelancer/agency)>"],
  "min_score": <integer 5-8, default 6>
}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return { ok: false, error: "Couldn't generate a suggestion. Try again in a moment." };
    const data = await res.json();
    const p = JSON.parse(data.choices[0].message.content);

    const toList = (v: unknown, cap: number) =>
      Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, cap) : [];
    const score = parseInt(String(p.min_score ?? 6), 10);
    const suggestion: NicheSuggestion = {
      name: (String(p.name ?? "").trim() || "My niche").slice(0, 60),
      niche_description: String(p.niche_description ?? "").trim().slice(0, 300),
      include_keywords: toList(p.include_keywords, 12),
      exclude_keywords: toList(p.exclude_keywords, 8),
      min_score: Number.isNaN(score) ? 6 : Math.min(10, Math.max(1, score)),
    };

    let remaining: number | null = null;
    if (!isPro) {
      await admin.from("profiles").update({ niche_wizard_uses: uses + 1 }).eq("id", user.id);
      remaining = Math.max(0, WIZARD_FREE_LIMIT - (uses + 1));
    }
    return { ok: true, suggestion, remaining };
  } catch {
    return { ok: false, error: "Couldn't generate a suggestion. Try again in a moment." };
  }
}

// Change a lead's status (new / contacted / saved / archived / irrelevant).
// "irrelevant" is the user's feedback that the AI scored a non-lead: it hides
// the card and gives us a signal to tune scoring later.
export async function setLeadStatus(leadId: string, status: string) {
  const supabase = createClient();
  await supabase.from("leads").update({ status }).eq("id", leadId);
  revalidatePath("/dashboard");
}

// Save a private note on a lead (empty string clears it).
export async function setLeadNote(leadId: string, note: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("leads").update({ note: note.trim() || null }).eq("id", leadId).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

// Create a new niche (watch), respecting the plan limit.
export async function createWatch(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles").select("plan").eq("id", user.id).maybeSingle();
  const { count } = await supabase
    .from("watches").select("id", { count: "exact", head: true }).eq("user_id", user.id);

  if ((count ?? 0) >= nicheLimit(profile?.plan)) {
    redirect("/dashboard/setup?error=limit");
  }

  await supabase.from("watches").insert({
    user_id: user.id,
    name: (formData.get("name") as string) || "New niche",
    niche_description: (formData.get("niche") as string) || "",
    include_keywords: parseList(formData.get("include")),
    exclude_keywords: parseList(formData.get("exclude")),
    min_score: parseScore(formData.get("min_score")),
    active: true,
  });

  revalidatePath("/dashboard/setup");
  redirect("/dashboard/setup?saved=created");
}

// Update an existing niche (only the caller's own).
export async function updateWatch(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get("id") as string;
  if (!id) return;

  await supabase.from("watches").update({
    name: (formData.get("name") as string) || "Niche",
    niche_description: (formData.get("niche") as string) || "",
    include_keywords: parseList(formData.get("include")),
    exclude_keywords: parseList(formData.get("exclude")),
    min_score: parseScore(formData.get("min_score")),
  }).eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard/setup");
  redirect("/dashboard/setup?saved=updated");
}

// Pause / resume a niche without deleting it.
export async function toggleWatch(id: string, active: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("watches").update({ active }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/setup");
}

// Delete a niche (and its leads go with it via the cascade, or are orphaned harmlessly).
export async function deleteWatch(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("watches").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/setup");
}

// Save email-digest preferences (off / daily / every 4h), delivery hour and timezone.
export async function saveDigestPrefs(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  let mode = String(formData.get("mode") ?? "daily");         // off | daily | every_4h
  const parsedHour = parseInt(String(formData.get("hour") ?? "8"), 10);
  const hour = Number.isNaN(parsedHour) ? 8 : Math.min(23, Math.max(0, parsedHour));
  const tz = String(formData.get("timezone") ?? "UTC").trim() || "UTC";

  const admin = createAdminClient();

  // "Every 4 hours" is a Pro feature — block it server-side for non-Pro plans.
  const { data: prof } = await admin.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  if (mode === "every_4h" && prof?.plan !== "pro") mode = "daily";

  await admin.from("profiles").update({
    digest_enabled: mode !== "off",
    digest_frequency: mode === "every_4h" ? "every_4h" : "daily",
    digest_hour: hour,
    timezone: tz,
  }).eq("id", user.id);

  revalidatePath("/dashboard/account");
  redirect("/dashboard/account?digest=saved");
}

// Update the account email (Supabase sends a confirmation to the new address).
export async function updateEmail(formData: FormData) {
  const supabase = createClient();
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/dashboard/account?email=invalid");

  const { error } = await supabase.auth.updateUser({ email });
  if (error) redirect("/dashboard/account?email=error");

  revalidatePath("/dashboard/account");
  redirect("/dashboard/account?email=sent");
}
