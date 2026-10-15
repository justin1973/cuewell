"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";

type Item = { href: string; label: string; icon: string };

export function Sidebar({ items, initials, subtitle }: { items: Item[]; initials: string; subtitle: string }) {
  const path = usePathname();
  return (
    <aside className="side">
      <div className="me">
        <div className="ava">{initials}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Your account</div>
          <div style={{ fontSize: 12, color: "var(--faint)" }}>{subtitle}</div>
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
