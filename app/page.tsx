import Link from "next/link";
import { Icon } from "@/components/icons";
import "./landing.css";

export default function LandingPage() {
  return (
    <>
      <div className="topbar">
        <div className="brand"><span className="logo" />Cuewell</div>
        <div style={{ flex: 1 }} />
        <Link className="btn btn-ghost sm" href="/login">Log in</Link>
        <Link className="btn btn-primary sm" href="/login?mode=signup">Start free</Link>
      </div>

      {/* HERO */}
      <div className="wrap hero">
        <div className="herogrid">
          <div>
            <div className="eyebrow">For freelancers, agencies and founders</div>
            <h1>Every day, someone asks for what you sell. You just don&apos;t see it.</h1>
            <p className="sub">
              Right now — on Hacker News, Lobsters and Stack Exchange — people are writing &quot;looking for an
              alternative to [competitor]&quot; or &quot;any tool recommendations for…&quot;. These are buyers
              ready to act. An advanced AI reads every conversation, works out who actually wants to
              buy, and brings them to your inbox each morning — with an intent score. You reply while
              it&apos;s hot.
            </p>
            <div className="cta">
              <Link className="btn btn-primary" href="/login?mode=signup">
                Start your 7-day trial<Icon name="arrow-right" />
              </Link>
              <a className="btn btn-ghost" href="#how-it-works">See how it works</a>
            </div>
            <p className="note">No credit card required · cancel anytime</p>
          </div>
          <div>
            <div className="card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <span className="vsrc"><Icon name="msg" />Hacker News</span>
                <div style={{ textAlign: "center", borderRadius: 9, padding: "5px 11px", minWidth: 52, background: "var(--hot-bg)" }}>
                  <div className="tab-nums" style={{ fontSize: 19, fontWeight: 700, color: "var(--hot)", lineHeight: 1.1 }}>9</div>
                  <div style={{ fontSize: 10, color: "var(--hot)" }}>intent</div>
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

      {/* PROBLEM */}
      <div className="band"><div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">The problem</div>
          <h2>Cold outreach doesn&apos;t work anymore.</h2>
          <p>Ignored messages, hours lost scrolling forums. Meanwhile the opportunities pass you by.</p>
        </div>
        <div className="contrast">
          <div className="cside">
            <div className="ch">Cold outreach</div>
            <div className="cpt"><Icon name="x" />You message people who never asked for anything</div>
            <div className="cpt"><Icon name="x" />98% of messages get ignored</div>
            <div className="cpt"><Icon name="x" />Hours of manual research, every day</div>
          </div>
          <div className="cside warmc">
            <div className="ch">With Cuewell</div>
            <div className="cpt ok"><Icon name="check" />You arrive while the person is searching</div>
            <div className="cpt ok"><Icon name="check" />You reply to someone who has the problem now</div>
            <div className="cpt ok"><Icon name="check" />The AI does the research for you</div>
          </div>
        </div>
      </div></div>

      {/* KILLER FEATURE */}
      <div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">The difference</div>
          <h2>It doesn&apos;t match keywords. It understands people.</h2>
          <p>An advanced AI model reads every post and judges real intent — like an experienced sales rep would, but across thousands of conversations a day. Here&apos;s what that means in practice:</p>
        </div>
        <div className="vs">
          <div className="vscard pass">
            <div className="vh"><Icon name="check" />CUEWELL SURFACES IT</div>
            <span className="vsrc"><Icon name="msg" />Hacker News</span>
            <div className="vpost">&quot;Our <span className="hl">Mailchimp</span> bill jumped to <span className="hl">$350/mo</span>. <span className="hl">Ready to migrate this week</span> — any cheaper alternative with automations?&quot;</div>
            <div className="vfoot"><div className="vscore"><b className="tab-nums">9</b><small>/10</small></div><div className="vreason">Searching now, with budget and urgency</div></div>
          </div>
          <div className="vscard rej">
            <div className="vh"><Icon name="x" />CUEWELL SKIPS IT</div>
            <span className="vsrc"><Icon name="msg" />Hacker News</span>
            <div className="vpost dim">&quot;Honestly I think <span style={{ textDecoration: "underline" }}>Mailchimp</span> is overpriced these days. Anyway, back to work.&quot;</div>
            <div className="vfoot"><div className="vscore"><b className="tab-nums">2</b><small>/10</small></div><div className="vreason">Just an opinion, not looking for anything</div></div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "var(--faint)", fontSize: 13.5, maxWidth: "54ch", margin: "20px auto 0" }}>
          Same word — &quot;Mailchimp&quot; — opposite intent. A keyword alert would send you both. Cuewell sends only the first.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="wrap" id="how-it-works">
        <div className="sechead" style={{ paddingTop: 56 }}>
          <div className="eyebrow">How it works</div>
          <h2>Up and running in three steps.</h2>
          <p>Set it once. Then everything lands in your inbox.</p>
        </div>
        <div className="steps">
          <div className="step"><div className="ic"><Icon name="tune" /></div><div className="n">Step 01</div><h3>Tell it what you sell</h3><p>Your niche and a few trigger phrases: &quot;alternative to&quot;, &quot;looking for a tool&quot;, a competitor&apos;s name. A minute of setup.</p></div>
          <div className="step"><div className="ic"><Icon name="funnel" /></div><div className="n">Step 02</div><h3>The AI does the heavy lifting</h3><p>It reads public conversations, filters out the noise, and scores every post from 1 to 10. Only real prospects get through.</p></div>
          <div className="step"><div className="ic"><Icon name="mail" /></div><div className="n">Step 03</div><h3>Receive warm leads</h3><p>Each morning, an email with the people most ready to buy and a direct link to the post. Open, reply, close.</p></div>
        </div>
      </div>

      {/* PRODUCT SHOT */}
      <div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">The dashboard</div>
          <h2>Your opportunities, ranked by intent.</h2>
          <p>Everything lands in one clean place. The hottest leads rise to the top — open, reply, close.</p>
        </div>
        <div className="shot">
          <div className="shot-bar"><span /><span /><span /></div>
          <div className="shot-body">
            <div className="shot-tiles">
              <div className="shot-tile"><div className="k">New today</div><div className="v tab-nums">3</div></div>
              <div className="shot-tile"><div className="k">Hot waiting</div><div className="v tab-nums" style={{ color: "var(--hot)" }}>2</div></div>
              <div className="shot-tile"><div className="k">Contacted</div><div className="v tab-nums">5</div></div>
            </div>
            <div className="shot-lead">
              <div className="shot-top">
                <div className="shot-chips"><span className="shot-chip">Hacker News</span><span>2 hours ago</span></div>
                <div className="shot-score hot"><div className="v tab-nums">9</div><div className="k">intent</div></div>
              </div>
              <div className="shot-title">Looking for an alternative to Mailchimp — pricing got out of hand</div>
              <p className="shot-quote">&quot;Bill jumped to $350/mo for a weekly newsletter. Ready to migrate this week.&quot;</p>
              <span className="shot-open">Open post <Icon name="arrow-ur" /></span>
            </div>
            <div className="shot-lead">
              <div className="shot-top">
                <div className="shot-chips"><span className="shot-chip">Stack Exchange</span><span>5 hours ago</span></div>
                <div className="shot-score warm"><div className="v tab-nums">7</div><div className="k">intent</div></div>
              </div>
              <div className="shot-title">Recommendations for a simple transactional email provider?</div>
              <p className="shot-quote">&quot;Evaluating options for a small SaaS — want something less clunky than what we have.&quot;</p>
              <span className="shot-open">Open post <Icon name="arrow-ur" /></span>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="band"><div className="wrap pblock">
        <div className="sechead">
          <div className="eyebrow">Pricing</div>
          <h2>One customer pays for a year of Cuewell.</h2>
          <p>Less than a coffee a week. No contracts, cancel anytime.</p>
        </div>
        <div className="plans">
          <div className="plan-card">
            <div className="pname">Solo</div>
            <div className="price tab-nums">€9<span>/mo</span></div>
            <div className="check"><Icon name="check" />1 niche monitored</div>
            <div className="check"><Icon name="check" />Daily email digest</div>
            <div className="check"><Icon name="check" />AI intent scoring</div>
            <Link className="btn btn-ghost sm" style={{ marginTop: 16, width: "100%" }} href="/login?mode=signup">Get started</Link>
          </div>
          <div className="plan-card reco">
            <span className="ptag">Recommended</span>
            <div className="pname">Pro</div>
            <div className="price tab-nums">€19<span>/mo</span></div>
            <div className="check"><Icon name="check" />Unlimited niches</div>
            <div className="check"><Icon name="check" />Digest every 4 hours</div>
            <div className="check"><Icon name="check" />More leads, across your niches</div>
            <Link className="btn btn-primary sm" style={{ marginTop: 16, width: "100%" }} href="/login?mode=signup">Start free</Link>
          </div>
        </div>
      </div></div>

      {/* FAQ */}
      <div className="wrap faq">
        <div className="sechead" style={{ marginBottom: 12 }}>
          <div className="eyebrow">FAQ</div>
          <h2>Frequently asked questions</h2>
        </div>
        {[
          ["Where do the leads come from?", "From public conversations on Hacker News, Lobsters and Stack Exchange, via their official APIs. No grey-area scraping and no private data — only what people write openly."],
          ["How many leads should I expect?", "Quality over quantity. Depending on your niche you might see a few strong leads a week rather than hundreds a day — but each one is someone actively searching right now, which is exactly what makes them worth your time. Niches whose customers discuss tools and software online produce the most."],
          ["How often do I get leads?", "A daily email digest, or every 4 hours on the Pro plan. Only when there are new leads — no empty emails cluttering your inbox."],
          ["How does the AI know it's a real lead?", "It reads every post and assigns an intent score from 1 to 10, rewarding people who are actively searching, with urgency or budget, and discarding opinions, curiosity and generic discussion."],
          ["Can't I just set up free keyword alerts myself?", "You can — tools like Google Alerts or F5Bot email you every mention of a keyword. The catch is they send everything: opinions, old threads, people not buying anything. You're back to triaging noise by hand. Cuewell reads each post, judges real intent, and sends only the ready-to-buy ones with a score — minutes of your time, not hours. One reply usually pays for the month."],
          ["Do you reply to leads for me?", "No. Cuewell brings you the right signal at the right time, with a link to the post. The conversation and the sale are yours — you're the expert, and a personal reply converts far better than an automated message."],
          ["Will it work for my niche?", "If your customers are people who are online and discuss software, products or digital services, yes. For purely local or offline markets it's less suited, because public conversations are scarce there."],
          ["Can I cancel anytime?", "Yes, anytime from your account settings. No lock-in, no penalty. The 7-day trial doesn't require a credit card."],
        ].map(([q, a]) => (
          <details className="qa" key={q}>
            <summary>{q}<Icon name="plus" className="icn pm" /></summary>
            <div className="ans">{a}</div>
          </details>
        ))}
      </div>

      <div className="wrap"><footer><span>© 2026 Cuewell</span><span>cuewell.io</span></footer></div>
    </>
  );
}
