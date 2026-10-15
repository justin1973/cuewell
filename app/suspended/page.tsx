export const dynamic = "force-dynamic";

export default function SuspendedPage() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Account suspended</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>
          Your Cuewell account has been paused. If you think this is a mistake,
          reach out to <a href="mailto:support@cuewell.io" style={{ textDecoration: "underline" }}>support@cuewell.io</a> and we&apos;ll take a look.
        </p>
        <a href="/login" style={{ display: "inline-block", marginTop: 18, fontSize: 14, color: "var(--muted)", textDecoration: "underline" }}>
          Back to sign in
        </a>
      </div>
    </main>
  );
}
