"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";

type Item = { href: string; label: string; icon: string };

function planBadge(plan: string | null, status: string | null) {
  if (status === "trialing") return { cls: "trial", label: "Trial" };
  if (plan === "pro") return { cls: "pro", label: "Pro" };
  if (plan === "solo") return { cls: "", label: "Solo" };
  return { cls: "", label: "Free" };
}

export function Sidebar({
  items, initials, subtitle, plan = null, status = null,
}: { items: Item[]; initials: string; subtitle: string; plan?: string | null; status?: string | null }) {
  const path = usePathname();
  const badge = planBadge(plan, status);
  return (
    <aside className="side">
      <div className="me">
        <div className="ava">{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, color: "var(--faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>
          <span className={`plan-badge ${badge.cls}`}>{badge.label}</span>
        </div>
      </div>
      <nav className="nav">
        {items.map((it) => {
          const active = it.href === "/dashboard" ? path === it.href : path.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={active ? "on" : ""}>
              <Icon name={it.icon} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="sidefoot">
        <form action="/auth/signout" method="post">
          <button className="signout" type="submit"><Icon name="logout" />Sign out</button>
        </form>
      </div>
    </aside>
  );
}
