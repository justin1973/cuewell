import Link from "next/link";

export function SiteFooter() {
  return (
    <div className="wrap">
      <footer className="sitefoot">
        <span>© {new Date().getFullYear()} Cuewell</span>
        <nav className="footlinks">
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms</Link>
          <a href="https://cuewell.io">cuewell.io</a>
        </nav>
      </footer>
    </div>
  );
}
