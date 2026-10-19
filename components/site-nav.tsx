import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Public top bar. Shows the account + logout when signed in, login/signup when not.
export async function SiteNav() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const initials = email.slice(0, 2).toUpperCase() || "CW";

  return (
    <div className="topbar">
      <Link className="brand" href="/"><span className="logo" />Cuewell</Link>
      <div style={{ flex: 1 }} />
      {user ? (
        <>
          <span className="navuser" title={email}>
            <span className="navava">{initials}</span>
            <span className="navemail">{email}</span>
          </span>
          <Link className="btn btn-primary sm" href="/dashboard">Dashboard</Link>
          <form action="/auth/signout" method="post">
            <button className="btn btn-ghost sm" type="submit">Log out</button>
          </form>
        </>
      ) : (
        <>
          <Link className="btn btn-ghost sm" href="/login">Log in</Link>
          <Link className="btn btn-primary sm" href="/login?mode=signup">Start free</Link>
        </>
      )}
    </div>
  );
}
