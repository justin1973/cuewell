// Simple 14-day bar chart, rendered server-side (no JS needed).
export function LeadsChart({
  counts, title = "Leads over the last 14 days", unit = "lead",
}: { counts: { label: string; n: number }[]; title?: string; unit?: string }) {
  const max = Math.max(1, ...counts.map((c) => c.n));
  const total = counts.reduce((s, c) => s + c.n, 0);
  return (
    <div className="chart">
      <h3>{title}</h3>
      <p className="ph">{total} {unit}{total === 1 ? "" : "s"} in this window.</p>
      <div className="bars">
        {counts.map((c, i) => (
          <div className="bar-col" key={i} title={`${c.label}: ${c.n}`}>
            <div className={`bar ${c.n > 0 ? "has" : ""}`} style={{ height: `${(c.n / max) * 100}%` }} />
            <span className="bar-x">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
