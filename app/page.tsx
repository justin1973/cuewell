import Link from "next/link";
import { Icon } from "@/components/icons";
import "./landing.css";

export default function LandingPage() {
  return (
    <>
      <div className="topbar">
        <div className="brand"><span className="logo" />Cuewell</div>
        <div style={{ flex: 1 }} />
        <Link className="btn btn-ghost sm" href="/login">Accedi</Link>
        <Link className="btn btn-primary sm" href="/login?mode=signup">Inizia gratis</Link>
      </div>

      {/* HERO */}
      <div className="wrap hero">
        <div className="herogrid">
          <div>
            <div className="eyebrow">Per freelance, agenzie e founder</div>
            <h1>Ogni giorno qualcuno chiede quello che vendi. Tu non lo sai.</h1>
            <p className="sub">
              In questo momento, su Hacker News e nei forum, c&apos;è chi scrive &quot;cerco
              un&apos;alternativa a [concorrente]&quot; o &quot;mi consigliate un tool per…&quot;. Sono
              clienti pronti all&apos;acquisto. Un&apos;AI avanzata legge ogni conversazione, capisce chi
              vuole davvero comprare e te lo porta ogni mattina — con un punteggio d&apos;intento. Tu
              rispondi finché è caldo.
            </p>
            <div className="cta">
              <Link className="btn btn-primary" href="/login?mode=signup">
                Provalo gratis per 7 giorni<Icon name="arrow-right" />
              </Link>
              <a className="btn btn-ghost" href="#come-funziona">Come funziona</a>
            </div>
            <p className="note">Nessuna carta richiesta · disdici quando vuoi</p>
          </div>
          <div>
            <div className="card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <span className="vsrc"><Icon name="msg" />Hacker News</span>
                <div style={{ textAlign: "center", borderRadius: 9, padding: "5px 11px", minWidth: 52, background: "var(--hot-bg)" }}>
                  <div className="tab-nums" style={{ fontSize: 19, fontWeight: 700, color: "var(--hot)", lineHeight: 1.1 }}>9</div>
                  <div style={{ fontSize: 10, color: "var(--hot)" }}>intento</div>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15.5, margin: "10px 0 7px", lineHeight: 1.35 }}>
                Looking for an alternative to Mailchimp — pricing got out of hand
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14, borderLeft: "2px solid var(--border-2)", paddingLeft: 12, margin: 0 }}>
                &quot;4-person startup, Mailchimp bill jumped to $350/mo for a weekly newsletter. Ready to migrate this week.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEMA */}
      <div className="band"><div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">Il problema</div>
          <h2>Inseguire clienti a freddo non funziona più.</h2>
          <p>Messaggi ignorati, ore perse a scrollare forum a mano. Intanto le occasioni passano.</p>
        </div>
        <div className="contrast">
          <div className="cside">
            <div className="ch">Outreach a freddo</div>
            <div className="cpt"><Icon name="x" />Scrivi a gente che non ti ha chiesto niente</div>
            <div className="cpt"><Icon name="x" />Il 98% dei messaggi finisce ignorato</div>
            <div className="cpt"><Icon name="x" />Ore di ricerca manuale, ogni giorno</div>
          </div>
          <div className="cside warmc">
            <div className="ch">Con Cuewell</div>
            <div className="cpt ok"><Icon name="check" />Arrivi quando è la persona a cercare</div>
            <div className="cpt ok"><Icon name="check" />Rispondi a chi ha già il problema, ora</div>
            <div className="cpt ok"><Icon name="check" />Il lavoro di ricerca lo fa l&apos;AI al posto tuo</div>
          </div>
        </div>
      </div></div>

      {/* KILLER FEATURE */}
      <div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">La differenza</div>
          <h2>Non cerca parole. Capisce le persone.</h2>
          <p>Un modello AI avanzato legge ogni post e giudica l&apos;intento reale — come farebbe un commerciale esperto, ma su migliaia di conversazioni al giorno. Ecco cosa significa, in pratica:</p>
        </div>
        <div className="vs">
          <div className="vscard pass">
            <div className="vh"><Icon name="check" />CUEWELL LA PROMUOVE</div>
            <span className="vsrc"><Icon name="msg" />Hacker News</span>
            <div className="vpost">&quot;Our <span className="hl">Mailchimp</span> bill jumped to <span className="hl">$350/mo</span>. <span className="hl">Ready to migrate this week</span> — any cheaper alternative with automations?&quot;</div>
            <div className="vfoot"><div className="vscore"><b className="tab-nums">9</b><small>/10</small></div><div className="vreason">Cerca ora, con budget e urgenza</div></div>
          </div>
          <div className="vscard rej">
            <div className="vh"><Icon name="x" />CUEWELL LA SCARTA</div>
            <span className="vsrc"><Icon name="msg" />Hacker News</span>
            <div className="vpost dim">&quot;Honestly I think <span style={{ textDecoration: "underline" }}>Mailchimp</span> is overpriced these days. Anyway, back to work.&quot;</div>
            <div className="vfoot"><div className="vscore"><b className="tab-nums">2</b><small>/10</small></div><div className="vreason">Solo un&apos;opinione, non cerca nulla</div></div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "var(--faint)", fontSize: 13.5, maxWidth: "54ch", margin: "20px auto 0" }}>
          Stessa parola — &quot;Mailchimp&quot; — ma intento opposto. Un alert a parole chiave te li manderebbe entrambi. Cuewell ti manda solo il primo.
        </p>
      </div>

      {/* COME FUNZIONA */}
      <div className="wrap" id="come-funziona">
        <div className="sechead" style={{ paddingTop: 56 }}>
          <div className="eyebrow">Come funziona</div>
          <h2>Pronto in tre passi.</h2>
          <p>Lo imposti una volta. Poi arriva tutto nella tua email.</p>
        </div>
        <div className="steps">
          <div className="step"><div className="ic"><Icon name="tune" /></div><div className="n">Passo 01</div><h3>Dici cosa vendi</h3><p>La tua nicchia e qualche parola-spia: &quot;alternative to&quot;, &quot;looking for a tool&quot;, il nome di un concorrente. Un minuto di setup.</p></div>
          <div className="step"><div className="ic"><Icon name="funnel" /></div><div className="n">Passo 02</div><h3>L&apos;AI fa il lavoro sporco</h3><p>Legge le conversazioni pubbliche, butta via il rumore e dà a ogni post un punteggio d&apos;intento da 1 a 10. Solo i veri potenziali clienti passano.</p></div>
          <div className="step"><div className="ic"><Icon name="mail" /></div><div className="n">Passo 03</div><h3>Ricevi i lead caldi</h3><p>Ogni mattina un&apos;email con le persone più pronte a comprare e il link diretto al post. Apri, rispondi, chiudi.</p></div>
        </div>
      </div>

      {/* PREZZO */}
      <div className="band"><div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">Prezzo</div>
          <h2>Un cliente ripaga un anno di Cuewell.</h2>
          <p>Meno di un caffè a settimana. Niente contratti, disdici quando vuoi.</p>
        </div>
        <div className="plans">
          <div className="plan-card">
            <div className="pname">Solo</div>
            <div className="price tab-nums">€9<span>/mese</span></div>
            <div className="check"><Icon name="check" />1 nicchia monitorata</div>
            <div className="check"><Icon name="check" />Email digest giornaliero</div>
            <div className="check"><Icon name="check" />Scoring d&apos;intento con AI</div>
            <Link className="btn btn-ghost sm" style={{ marginTop: 16, width: "100%" }} href="/login?mode=signup">Inizia</Link>
          </div>
          <div className="plan-card reco">
            <span className="ptag">Consigliato</span>
            <div className="pname">Pro</div>
            <div className="price tab-nums">€19<span>/mese</span></div>
            <div className="check"><Icon name="check" />Nicchie illimitate</div>
            <div className="check"><Icon name="check" />Digest ogni 4 ore</div>
            <div className="check"><Icon name="check" />Più lead al giorno</div>
            <Link className="btn btn-primary sm" style={{ marginTop: 16, width: "100%" }} href="/login?mode=signup">Inizia gratis</Link>
          </div>
        </div>
      </div></div>

      {/* FAQ */}
      <div className="wrap faq">
        <div className="sechead" style={{ marginBottom: 12 }}>
          <div className="eyebrow">FAQ</div>
          <h2>Domande frequenti</h2>
        </div>
        {[
          ["Da dove arrivano i lead?", "Da conversazioni pubbliche su Hacker News e fonti simili, tramite le loro API ufficiali. Niente scraping grigio e nessun dato privato: solo ciò che le persone scrivono apertamente."],
          ["Ogni quanto ricevo i lead?", "Un'email digest al giorno, oppure ogni 4 ore sul piano Pro. Solo quando ci sono lead nuovi: niente email vuote a riempirti la casella."],
          ["Come fa l'AI a capire se è un lead vero?", "Legge ogni post e assegna un punteggio d'intento da 1 a 10, premiando chi cerca attivamente, con urgenza o budget, e scartando opinioni, curiosità e discussioni generiche."],
          ["Rispondete voi ai lead al posto mio?", "No. Cuewell ti porta la segnalazione giusta al momento giusto, con il link al post. La conversazione e la vendita le fai tu — sei tu l'esperto, e un contatto personale converte molto meglio di un messaggio automatico."],
          ["Funziona per la mia nicchia?", "Se i tuoi clienti sono persone che stanno online e discutono di software, prodotti o servizi digitali, sì. Per mercati puramente locali o offline è meno adatto, perché lì le conversazioni pubbliche scarseggiano."],
          ["Posso disdire quando voglio?", "Sì, in qualsiasi momento dalle impostazioni dell'account. Nessun vincolo e nessuna penale. La prova di 7 giorni non richiede carta di credito."],
        ].map(([q, a]) => (
          <details className="qa" key={q}>
            <summary>{q}<Icon name="plus" className="icn pm" /></summary>
            <div className="ans">{a}</div>
          </details>
        ))}
      </div>

      <div className="wrap"><footer><span>© 2026 Cuewell</span><span>rateradar.pro</span></footer></div>
    </>
  );
}
