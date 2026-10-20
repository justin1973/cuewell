import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import "../landing.css";

export const metadata = { title: "Privacy Policy", description: "How Cuewell collects and handles your personal data under the EU GDPR." };

// NOTE FOR THE OWNER: replace [bracketed] placeholders with the real data-controller
// identity (your legal name as a private individual) and have this reviewed by a
// professional. GDPR requires the controller to be identifiable.
export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <div className="wrap legal legal-prose">
        <div className="legal-head">
          <div className="eyebrow">Legal</div>
          <h1>Privacy Policy</h1>
          <p>Last updated: [date]</p>
        </div>

        <p>This Privacy Policy explains how Cuewell (&quot;we&quot;, &quot;us&quot;) collects and uses personal data when you use our website and service (the &quot;Service&quot;), in accordance with the EU General Data Protection Regulation (GDPR) and Italian data-protection law.</p>

        <h2>1. Data controller</h2>
        <p>The data controller is Cuewell, an online service operated by a private individual based in Italy. For any privacy matter you can contact us at <a href="mailto:hello@cuewell.io">hello@cuewell.io</a>. [Owner: add your full legal name and contact address here — GDPR requires the controller to be identifiable.]</p>

        <h2>2. What data we collect</h2>
        <p><strong>Account data:</strong> your email address and an encrypted (hashed) password, and your plan. <strong>Payment data:</strong> processed by our payment provider; we do not store your card number. <strong>Service data:</strong> the niches, keywords, settings, saved leads and private notes you create. <strong>Technical data:</strong> basic logs and cookies needed to keep you signed in and to keep the Service secure. <strong>Public post data:</strong> text and author usernames from public posts on third-party platforms that match the keywords you configure.</p>

        <h2>3. Why we use it, and our legal bases</h2>
        <p>We process your data to: provide and operate the Service and your account (performance of a contract); process your subscription and payments (contract and legal obligations, e.g. accounting); send you the email digests you have enabled (your choice/consent — you can turn them off at any time); keep the Service secure and improve it (our legitimate interests); and analyse public posts to surface potential leads for you (our and your legitimate interests in identifying publicly expressed buying intent).</p>

        <h2>4. Who we share data with</h2>
        <p>We use trusted service providers who process data on our behalf, under data-processing agreements:</p>
        <p>• <strong>Supabase</strong> — database, authentication and hosting.<br />
        • <strong>Stripe</strong> — payment processing.<br />
        • <strong>Resend</strong> — sending transactional and digest emails.<br />
        • <strong>OpenAI</strong> — analysing post content to score buying intent.<br />
        • <strong>Vercel</strong> — hosting the website and application.<br />
        • <strong>Google Analytics</strong> — aggregated, anonymous statistics on how visitors use our website.</p>
        <p>We do not sell your personal data.</p>

        <h2>5. International transfers</h2>
        <p>Some of these providers are based outside the European Economic Area (for example, in the United States). Where data is transferred outside the EEA, it is protected by appropriate safeguards such as the European Commission&apos;s Standard Contractual Clauses.</p>

        <h2>6. How long we keep it</h2>
        <p>We keep your account and service data for as long as your account is active. When you delete your account, we delete your personal data, except where we must retain certain records (such as invoices) to comply with legal obligations.</p>

        <h2>7. Your rights</h2>
        <p>Under the GDPR you have the right to access your data, correct it, delete it, restrict or object to its processing, and receive it in a portable format. Where processing is based on consent, you can withdraw it at any time. To exercise any of these, email <a href="mailto:hello@cuewell.io">hello@cuewell.io</a>. You also have the right to lodge a complaint with the Italian supervisory authority, the Garante per la protezione dei dati personali (garanteprivacy.it).</p>

        <h2>8. Cookies &amp; analytics</h2>
        <p>We use essential cookies required to sign you in and keep your session and the Service secure. We also use Google Analytics, which sets cookies to collect aggregated, anonymous statistics about how visitors use our website (such as pages viewed). We do not use advertising cookies. You can opt out of Google Analytics using Google&apos;s browser add-on or your browser&apos;s cookie settings.</p>

        <h2>9. People featured in leads</h2>
        <p>The Service surfaces publicly available posts, which may include the username and text of the person who posted. If you are the author of such a post and wish to have related data removed from our systems, contact us at <a href="mailto:hello@cuewell.io">hello@cuewell.io</a>.</p>

        <h2>10. Changes</h2>
        <p>We may update this Policy from time to time. Material changes will be notified by reasonable means, and the &quot;last updated&quot; date above will change.</p>

        <h2>11. Contact</h2>
        <p>Questions about your privacy? Email <a href="mailto:hello@cuewell.io">hello@cuewell.io</a> or use our <a href="/contact">contact page</a>.</p>
      </div>
      <SiteFooter />
    </>
  );
}
