"use client";

import { useTransition } from "react";
import { Icon } from "@/components/icons";
import { setSuspended, setPlan, deleteUser } from "@/app/admin/actions";

export type AdminUser = {
  id: string;
  email: string;
  plan: string | null;
  status: string | null;
  suspended: boolean;
  leads: number;
  watches: number;
  createdAt: string | null;
  lastSignIn: string | null;
  isSelf: boolean;
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

export function AdminUserRow({ u }: { u: AdminUser }) {
  const [pending, start] = useTransition();
  const planLabel = u.plan === "pro" ? "Pro" : u.plan === "solo" ? "Solo" : "Free";

  return (
    <tr className={u.suspended ? "susp" : ""} style={pending ? { opacity: 0.4 } : undefined}>
      <td>
        <div className="u-email">{u.email}{u.isSelf && <span className="hint"> (you)</span>}</div>
        <div className="hint">joined {fmt(u.createdAt)} · last seen {fmt(u.lastSignIn)}</div>
      </td>
      <td>
        <select
          className="plan-pill"
          defaultValue={u.plan ?? "free"}
          onChange={(e) => start(() => setPlan(u.id, e.target.value))}
          style={{ cursor: "pointer" }}
          aria-label={`Plan for ${u.email}`}
        >
          <option value="free">Free</option>
          <option value="solo">Solo</option>
          <option value="pro">Pro</option>
        </select>
      </td>
      <td>
        {u.suspended
          ? <span className="badge fail">Suspended</span>
          : <span className="badge ok">{u.status ? u.status : "Active"}</span>}
      </td>
      <td className="tab-nums">{u.watches}</td>
      <td className="tab-nums">{u.leads}</td>
      <td>
        <div className="rowact">
          {!u.isSelf && (
            <button
              className="iconbtn"
              title={u.suspended ? "Reinstate" : "Suspend"}
              onClick={() => start(() => setSuspended(u.id, !u.suspended))}
            >
              <Icon name={u.suspended ? "play" : "ban"} />
            </button>
          )}
          {!u.isSelf && (
            <button
              className="iconbtn danger-b"
              title="Delete user"
              onClick={() => {
                if (confirm(`Permanently delete ${u.email} and all their data? This can't be undone.`)) {
                  start(() => deleteUser(u.id));
                }
              }}
            >
              <Icon name="trash" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
