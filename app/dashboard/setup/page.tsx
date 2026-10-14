import { createClient } from "@/lib/supabase/server";
import { saveWatch } from "../actions";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: watch } = await supabase
    .from("watches")
    .select("name, niche_description, include_keywords, exclude_keywords")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();

  return (
    <>
      <div className="phead"><h2>Setup &amp; parole chiave</h2></div>
      <p className="subt">Dì a Cuewell cosa cercare per te.</p>

      <form action={saveWatch} className="panel">
        <h3>La tua nicchia</h3>
        <p className="ph">Descrivi cosa vendi: l&apos;AI la usa per capire quali post sono davvero lead.</p>

        <div className="field">
          <label>Nome</label>
          <input className="input" name="name" defaultValue={watch?.name ?? "La mia nicchia"} />
        </div>
        <div className="field">
          <label>Descrizione</label>
          <input className="input" name="niche" defaultValue={watch?.niche_description ?? ""} placeholder="Strumenti di email marketing per piccole startup" />
        </div>
        <div className="field">
          <label>Parole chiave da intercettare (separate da virgola)</label>
          <input className="input" name="include" defaultValue={(watch?.include_keywords ?? []).join(", ")} placeholder="alternative to mailchimp, switching from, email tool recommendation" />
        </div>
        <div className="field">
          <label>Parole da escludere (separate da virgola)</label>
          <input className="input" name="exclude" defaultValue={(watch?.exclude_keywords ?? []).join(", ")} placeholder="HN alternative, community, sites like" />
        </div>
        <button className="btn btn-primary sm" type="submit">Salva</button>
      </form>
    </>
  );
}
