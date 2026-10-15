"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { createUser } from "@/app/admin/actions";

export function AdminCreateUser() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="btn btn-ghost sm" onClick={() => setOpen(true)}>
        <Icon name="plus" />Create user
      </button>
    );
  }

  return (
    <form action={createUser} className="mini-form">
      <input type="email" name="email" placeholder="email@example.com" required style={{ minWidth: 200 }} />
      <input type="text" name="password" placeholder="temp password (8+ chars)" minLength={8} required style={{ minWidth: 180 }} />
      <select name="plan" defaultValue="free">
        <option value="free">Free</option>
        <option value="solo">Solo</option>
        <option value="pro">Pro</option>
      </select>
      <button className="btn btn-primary sm" type="submit">Create</button>
      <button type="button" className="btn btn-ghost sm" onClick={() => setOpen(false)}>Cancel</button>
    </form>
  );
}
