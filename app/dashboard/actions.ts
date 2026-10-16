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

// Change a lead's status (new / contacted / saved / archived).
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

  const mode = String(formData.get("mode") ?? "daily");       // off | daily | every_4h
  const hour = Math.min(23, Math.max(0, parseInt(String(formData.get("hour") ?? "8"), 10) || 8));
  const tz = String(formData.get("timezone") ?? "UTC").trim() || "UTC";

  const admin = createAdminClient();
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
