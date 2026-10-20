import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import "../landing.css";

export const metadata = { title: "Terms & Conditions", description: "The terms governing access to and use of the Cuewell service." };

// NOTE FOR THE OWNER: replace the [bracketed] placeholders with your real legal
// details and have this reviewed by a lawyer before relying on it. A separate
// Privacy Policy is recommended for EU/GDPR compliance.
export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <div className="wrap legal legal-prose">
        <div className="legal-head">
          <div className="eyebrow">Legal</div>
          <h1>Terms &amp; Conditions</h1>
          <p>Last updated: [date]</p>
        </div>

        <p>These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of Cuewell (the &quot;Service&quot;), operated by Cuewell, an online service run by a private individual based in Italy (&quot;we&quot;, &quot;us&quot;). By creating an account or using the Service you agree to these Terms. If you do not agree, do not use the Service.</p>

        <h2>1. The Service</h2>
        <p>Cuewell monitors publicly available conversations on third-party platforms (currently Hacker News, Lobsters and Stack Exchange) and uses automated analysis to surface posts that may indicate buying intent relevant to the keywords and niches you configure. The Service presents these as &quot;leads&quot; in a dashboard and, optionally, by email.</p>

        <h2>2. Eligibility &amp; accounts</h2>
        <p>You must be at least 18 years old and able to enter into a binding contract. You are responsible for the accuracy of the information you provide, for keeping your login credentials secure, and for all activity under your account.</p>

        <h2>3. Subscriptions, trials &amp; billing</h2>
        <p>The Service is offered on paid subscription plans, with a free trial period where indicated. Paid plans renew automatically for successive periods until cancelled. Payments are processed by our payment provider (Stripe); by subscribing you authorise recurring charges to your chosen payment method. Prices are shown on our website and may change with notice for future billing periods.</p>

        <h2>4. Cancellation &amp; refunds</h2>
        <p>You may cancel at any time from your account settings; cancellation takes effect at the end of the current billing period, and you retain access until then. Except where required by applicable law, payments already made are non-refundable.</p>

        <h2>5. Acceptable use</h2>
        <p>You agree not to use the Service to: break any law; send spam or unsolicited bulk messages; harass, deceive or harm any person; attempt to disrupt, reverse-engineer or gain unauthorised access to the Service; or resell or redistribute the Service or its data except as expressly permitted. How you contact the people behind the leads, and your compliance with anti-spam and data-protection laws when doing so, is your responsibility.</p>

        <h2>6. Third-party sources</h2>
        <p>The Service relies on data from third-party platforms accessed through their public interfaces. We do not control those platforms and are not responsible for their content, availability, accuracy, or changes to their access terms. A source may become unavailable without notice.</p>

        <h2>7. Your data &amp; privacy</h2>
        <p>We process the personal data you provide (such as your email) to operate the Service, as described in our Privacy Policy. We act in accordance with applicable data-protection law, including the EU GDPR. See our <a href="/privacy">Privacy Policy</a> for details.</p>

        <h2>8. Intellectual property</h2>
        <p>The Service, including its software, design and content (excluding third-party post content and the data you input), is owned by us and protected by intellectual-property laws. We grant you a limited, non-exclusive, non-transferable right to use the Service for your own business purposes during your subscription.</p>

        <h2>9. No guarantee of results</h2>
        <p>The Service surfaces potential signals; it does not guarantee a minimum number of leads, their accuracy, their relevance, or any business outcome. Intent scores are automated estimates and may be wrong. You are responsible for reviewing leads before acting on them.</p>

        <h2>10. Disclaimers &amp; limitation of liability</h2>
        <p>The Service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind to the fullest extent permitted by law. To the maximum extent permitted by law, our total liability for any claim relating to the Service is limited to the amount you paid us in the 12 months before the event giving rise to the claim. We are not liable for indirect or consequential losses. Nothing in these Terms limits liability that cannot be limited by law.</p>

        <h2>11. Suspension &amp; termination</h2>
        <p>We may suspend or terminate your access if you breach these Terms or if required to protect the Service or other users. You may stop using the Service at any time. On termination, your right to use the Service ends; sections intended to survive (such as payment obligations, disclaimers and limitations) continue to apply.</p>

        <h2>12. Changes</h2>
        <p>We may update the Service and these Terms from time to time. Material changes to the Terms will be notified by reasonable means; continued use after changes take effect constitutes acceptance.</p>

        <h2>13. Governing law</h2>
        <p>These Terms are governed by the laws of Italy, and any dispute will be subject to the exclusive jurisdiction of the competent courts of Italy, except where mandatory consumer-protection law provides otherwise.</p>

        <h2>14. Contact</h2>
        <p>Questions about these Terms? Write to <a href="mailto:hello@cuewell.io">hello@cuewell.io</a> or use our <a href="/contact">contact page</a>.</p>
      </div>
      <SiteFooter />
    </>
  );
}
