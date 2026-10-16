"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Confirm the caller is an admin before any privileged action.
async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) throw new Error("Not authorized");
  return user!;
}

// Suspend or reinstate a user.
export async function setSuspended(userId: string, suspended: boolean) {
  const me = await requireAdmin();
  if (suspended && me.id === userId) return; // never let an admin suspend (lock out) themselves
  const admin = createAdminClient();
  await admin.from("profiles").update({ suspended }).eq("id", userId);
  revalidatePath("/admin");
}

// Change a user's plan manually (solo / pro / free).
export async function setPlan(userId: string, plan: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const value = plan === "free" ? null : plan;
  await admin.from("profiles").update({ plan: value }).eq("id", userId);
  revalidatePath("/admin");
}

// Permanently delete a user and everything they own.
export async function deleteUser(userId: string) {
  const me = await requireAdmin();
  if (me.id === userId) return; // never let an admin delete themselves
  const admin = createAdminClient();
  // Clean up owned rows first (the cascade also covers this, belt-and-braces).
  await admin.from("leads").delete().eq("user_id", userId);
  await admin.from("watches").delete().eq("user_id", userId);
  await admin.from("profiles").delete().eq("id", userId);
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin");
}

// Create a user manually. They can reset their password via the login page.
export async function createUser(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const plan = String(formData.get("plan") ?? "free");

  if (!email || password.length < 8) {
    redirect("/admin?created=invalid");
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    redirect("/admin?created=error");
  }

  if (plan !== "free") {
    await admin.from("profiles").update({ plan }).eq("id", data.user.id);
  }

  revalidatePath("/admin");
  redirect("/admin?created=ok");
}
