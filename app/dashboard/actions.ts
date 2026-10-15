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
