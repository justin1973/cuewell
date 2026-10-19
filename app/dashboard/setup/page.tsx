import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NicheCard, type Watch } from "@/components/niche-card";
import { NicheForm } from "@/components/niche-form";
import { Icon } from "@/components/icons";
import Link from "next/link";

const WIZARD_FREE_LIMIT = 3;

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
  const [{ data: watches }, { data: profile }, { data: leadRows }] = await Promise.all([
    supabase
      .from("watches")
      .select("id, name, niche_description, include_keywords, exclude_keywords, min_score, active, last_run_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
    admin.from("profiles").select("plan, niche_wizard_uses").eq("id", user!.id).maybeSingle(),
    supabase.from("leads").select("watch_id").eq("user_id", user!.id),
  ]);

  const list = (watches ?? []) as Watch[];
  const leadsByWatch = new Map<string, number>();
  (leadRows ?? []).forEach((r) => leadsByWatch.set(r.watch_id, (leadsByWatch.get(r.watch_id) ?? 0) + 1));
  const isPro = profile?.plan === "pro";
  const wizardRemaining = isPro ? null : Math.max(0, WIZARD_FREE_LIMIT - (profile?.niche_wizard_uses ?? 0));
  const limit = isPro ? Infinity : 1;
  const atLimit = list.length >= limit;

  const editing = searchParams.edit ? list.find((w) => w.id === searchParams.edit) : undefined;
  const showForm = searchParams.new === "1" || !!editing || list.length === 0;

  // ---- FORM VIEW (create or edit) ----
  if (showForm) {
    const w = editing;
    return (
      <>
        <div className="phead"><h2>{w ? "Edit niche" : "New niche"}</h2></div>
        <p className="subt">Tell Cuewell what to look for — the AI uses this to judge which posts are real leads.</p>
        <NicheForm watch={w} isPro={isPro} wizardRemaining={wizardRemaining} showCancel={list.length > 0} />
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
        {list.map((w) => <NicheCard key={w.id} watch={w} leads={leadsByWatch.get(w.id) ?? 0} />)}
      </div>

      {atLimit && !isPro && (
        <p className="hint" style={{ marginTop: 14 }}>
          Want to watch more than one niche? <Link href="/dashboard/account" style={{ textDecoration: "underline" }}>Upgrade to Pro</Link>.
        </p>
      )}
    </>
  );
}
