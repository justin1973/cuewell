import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import "../landing.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact · Cuewell" };

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <div className="wrap legal">
        <div className="legal-head">
          <div className="eyebrow">Contact</div>
          <h1>Get in touch.</h1>
          <p>Questions, feedback, a tricky niche to set up, or help with your account — we read every message.</p>
        </div>

        <div className="legal-grid">
          <ContactForm />
          <div className="legal-aside">
            <h3>Prefer email?</h3>
            <p>Write to <a href="mailto:hello@cuewell.io">hello@cuewell.io</a> and we&apos;ll reply within a couple of working days.</p>
            <h3 style={{ marginTop: 18 }}>Already a customer?</h3>
            <p>You can manage your plan, email settings and account any time from <a href="/dashboard/account">Account &amp; billing</a>.</p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
