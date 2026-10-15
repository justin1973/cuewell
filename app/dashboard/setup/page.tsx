import { createClient } from "@/lib/supabase/server";
import { saveWatch } from "../actions";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: watch } = await supabase
    .from("watches")
    .select("name, niche_description, include_keywords, exclude_keywords")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();

  const saved = searchParams.saved === "1";

  return (
    <>
      <div className="phead"><h2>Setup &amp; keywords</h2></div>
      <p className="subt">Tell Cuewell what to look for.</p>

      {saved && (
        <div className="savebar">
          <Icon name="check" /> Saved. Your watch is updated — the next run will use it.
        </div>
      )}

      <form action={saveWatch} className="panel">
        <h3>Your niche</h3>
        <p className="ph">Describe what you sell — the AI uses this to judge which posts are real leads.</p>

        <div className="field">
          <label>Name</label>
          <input className="input" name="name" defaultValue={watch?.name ?? "My niche"} />
        </div>
        <div className="field">
          <label>Description</label>
          <input className="input" name="niche" defaultValue={watch?.niche_description ?? ""} placeholder="Email marketing tools for small startups" />
        </div>
        <div className="field">
          <label>Keywords to catch <span style={{ color: "var(--faint)", fontWeight: 400 }}>(comma-separated)</span></label>
          <input className="input" name="include" defaultValue={(watch?.include_keywords ?? []).join(", ")} placeholder="alternative to mailchimp, switching from, email tool recommendation" />
        </div>
        <div className="field">
          <label>Words to exclude <span style={{ color: "var(--faint)", fontWeight: 400 }}>(comma-separated)</span></label>
          <input className="input" name="exclude" defaultValue={(watch?.exclude_keywords ?? []).join(", ")} placeholder="hn alternative, community, sites like" />
        </div>
        <button className="btn btn-primary sm" type="submit">Save changes</button>
      </form>
    </>
  );
}
