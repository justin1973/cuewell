import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import "./dashboard.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const initials = email.slice(0, 2).toUpperCase() || "CW";

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles").select("plan, subscription_status, current_period_end").eq("id", user!.id).maybeSingle();

  // Giorni rimasti di prova, per la spinta all'upgrade in sidebar.
  let trialEndsInDays: number | null = null;
  if (profile?.subscription_status === "trialing" && profile.current_period_end) {
    const ms = new Date(profile.current_period_end).getTime() - Date.now();
    trialEndsInDays = ms > 0 ? Math.ceil(ms / 86_400_000) : 0;
  }

  const items = [
    { href: "/dashboard", label: "Opportunities", icon: "zap" },
    { href: "/dashboard/setup", label: "Setup & keywords", icon: "tune" },
    { href: "/dashboard/account", label: "Account & billing", icon: "user" },
  ];
  if (isAdmin(user?.email)) items.push({ href: "/admin", label: "Admin", icon: "settings" });

  return (
    <div className="app">
      <Sidebar
        items={items}
        initials={initials}
        subtitle={email}
        plan={profile?.plan ?? null}
        status={profile?.subscription_status ?? null}
        trialEndsInDays={trialEndsInDays}
      />
      <section className="main">{children}</section>
    </div>
  );
}
