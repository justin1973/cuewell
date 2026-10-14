import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import "./dashboard.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const initials = email.slice(0, 2).toUpperCase() || "CW";

  const items = [
    { href: "/dashboard", label: "Feed opportunità", icon: "zap" },
    { href: "/dashboard/setup", label: "Setup & parole chiave", icon: "tune" },
    { href: "/dashboard/account", label: "Account & abbonamento", icon: "user" },
  ];

  return (
    <div className="app">
      <Sidebar items={items} initials={initials} subtitle={email} />
      <section className="main">{children}</section>
    </div>
  );
}
