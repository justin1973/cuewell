import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createWatch, updateWatch } from "../actions";
import { NicheCard, type Watch } from "@/components/niche-card";
import { Icon } from "@/components/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SAVED_MSG: Record<string, string> = {
  created: "Niche created — the next engine run will start watching it.",
  updated: "Changes saved — the next run will use them.",
};

export default async function SetupPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string; new?: string; edit?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const [{ data: watches }, { data: profile }] = await Promise.all([
    supabase
      .from("watches")
      .select("id, name, niche_description, include_keywords, exclude_keywords, min_score, active")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
    admin.from("profiles").select("plan").eq("id", user!.id).maybeSingle(),
  ]);

  const list = (watches ?? []) as Watch[];
  const isPro = profile?.plan === "pro";
  const limit = isPro ? Infinity : 1;
  const atLimit = list.length >= limit;

  const editing = searchParams.edit ? list.find((w) => w.id === searchParams.edit) : undefined;
  const showForm = searchParams.new === "1" || !!editing || list.length === 0;

  // ---- FORM VIEW (create or edit) ----
  if (showForm) {
    const w = editing;
    const action = w ? updateWatch : createWatch;
    return (
      <>
        <div className="phead"><h2>{w ? "Edit niche" : "New niche"}</h2></div>
        <p className="subt">Tell Cuewell what to look for — the AI uses this to judge which posts are real leads.</p>

        <form action={action} className="panel">
          {w && <input type="hidden" name="id" value={w.id} />}
          <div className="field">
            <label>Name</label>
            <input className="input" name="name" defaultValue={w?.name ?? ""} placeholder="e.g. Mailchimp switchers" required />
          </div>
          <div className="field">
            <label>What you sell</label>
            <input className="input" name="niche" defaultValue={w?.niche_description ?? ""} placeholder="Email marketing tool for small startups" />
          </div>
          <div className="field">
            <label>Keywords to catch <span className="hint">(comma-separated)</span></label>
            <input className="input" name="include" defaultValue={(w?.include_keywords ?? []).join(", ")} placeholder="alternative to mailchimp, switching from, email tool recommendation" />
          </div>
          <div className="field">
            <label>Words to exclude <span className="hint">(comma-separated)</span></label>
            <input className="input" name="exclude" defaultValue={(w?.exclude_keywords ?? []).join(", ")} placeholder="free, community, sites like" />
          </div>
          <div className="field">
            <label>Minimum intent score <span className="hint">(1–10 — only keep leads at or above this)</span></label>
            <input className="input" type="number" name="min_score" min={1} max={10} defaultValue={w?.min_score ?? 5} style={{ maxWidth: 120 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary sm" type="submit">{w ? "Save changes" : "Create niche"}</button>
            {list.length > 0 && (
              <Link className="btn btn-ghost sm" href="/dashboard/setup">Cancel</Link>
            )}
          </div>
        </form>
      </>
    );
  }

  // ---- LIST VIEW ----
  return (
    <>
      <div className="phead">
        <h2>Setup &amp; keywords</h2>
        {atLimit ? (
          <span className="btn btn-ghost sm" style={{ opacity: 0.55, cursor: "default" }} title="Solo includes one niche">
            <Icon name="plus" />New niche
          </span>
        ) : (
          <Link className="btn btn-primary sm" href="/dashboard/setup?new=1"><Icon name="plus" />New niche</Link>
        )}
      </div>
      <p className="subt">The niches Cuewell is watching for you. {isPro ? "Pro — unlimited niches." : `Solo — ${list.length}/1 niche.`}</p>

      {searchParams.saved && SAVED_MSG[searchParams.saved] && (
        <div className="savebar"><Icon name="check" /> {SAVED_MSG[searchParams.saved]}</div>
      )}
      {searchParams.error === "limit" && (
        <div className="savebar warn">
          <Icon name="alert" /> Your Solo plan includes one niche. Upgrade to Pro for unlimited.
        </div>
      )}

      <div className="niche-grid">
        {list.map((w) => <NicheCard key={w.id} watch={w} />)}
      </div>

      {atLimit && !isPro && (
        <p className="hint" style={{ marginTop: 14 }}>
          Want to watch more than one niche? <Link href="/dashboard/account" style={{ textDecoration: "underline" }}>Upgrade to Pro</Link>.
        </p>
      )}
    </>
  );
}
