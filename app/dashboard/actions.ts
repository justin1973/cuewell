"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Change a lead's status (new / contacted / saved / archived).
export async function setLeadStatus(leadId: string, status: string) {
  const supabase = createClient();
  await supabase.from("leads").update({ status }).eq("id", leadId);
  revalidatePath("/dashboard");
}

// Create or update the user's watch (one per user in v1).
export async function saveWatch(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = (formData.get("name") as string) || "My niche";
  const niche = (formData.get("niche") as string) || "";
  const include = (formData.get("include") as string || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const exclude = (formData.get("exclude") as string || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const { data: existing } = await supabase
    .from("watches").select("id").eq("user_id", user.id).limit(1).maybeSingle();

  if (existing) {
    await supabase.from("watches").update({
      name, niche_description: niche, include_keywords: include, exclude_keywords: exclude,
    }).eq("id", existing.id);
  } else {
    await supabase.from("watches").insert({
      user_id: user.id, name, niche_description: niche,
      include_keywords: include, exclude_keywords: exclude,
    });
  }
  revalidatePath("/dashboard/setup");
  redirect("/dashboard/setup?saved=1");
}
