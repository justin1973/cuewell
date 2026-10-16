"use client";

import { useEffect, useState } from "react";
import { saveDigestPrefs } from "@/app/dashboard/actions";

type Mode = "off" | "daily" | "every_4h";

export function DigestSettings({
  enabled, frequency, hour, timezone,
}: { enabled: boolean; frequency: string; hour: number; timezone: string | null }) {
  const [mode, setMode] = useState<Mode>(!enabled ? "off" : frequency === "every_4h" ? "every_4h" : "daily");
  const [h, setH] = useState<number>(hour ?? 8);
  const [tz, setTz] = useState<string>(timezone && timezone !== "UTC" ? timezone : "UTC");

  // If no timezone stored yet, detect the browser's and use it.
  useEffect(() => {
    if (!timezone || timezone === "UTC") {
      try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); } catch { /* keep UTC */ }
    }
  }, [timezone]);

  const tabs: { key: Mode; label: string }[] = [
    { key: "off", label: "Off" },
    { key: "daily", label: "Daily" },
    { key: "every_4h", label: "Every 4 hours" },
  ];

  return (
    <form action={saveDigestPrefs} className="panel">
      <h3>Email digest</h3>
      <p className="ph">Get your new leads by email, or keep everything in the dashboard only.</p>

      <div className="seg" role="group" aria-label="Email frequency" style={{ marginBottom: 14 }}>
        {tabs.map((t) => (
          <button key={t.key} type="button" className={mode === t.key ? "on" : ""} onClick={() => setMode(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {mode === "off" ? (
        <p className="hint">You&apos;ll see leads in the dashboard only — no emails.</p>
      ) : mode === "daily" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 13.5, color: "var(--muted)" }}>
          <span>Delivered around</span>
          <select name="hour" className="minisel" value={h} onChange={(e) => setH(parseInt(e.target.value, 10))} aria-label="Delivery hour">
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
            ))}
          </select>
          <span>({tz})</span>
        </div>
      ) : (
        <p className="hint">Delivered every 4 hours, only when there are new leads.</p>
      )}

      {mode !== "daily" && <input type="hidden" name="hour" value={h} />}
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="timezone" value={tz} />

      <button className="btn btn-primary sm" type="submit" style={{ marginTop: 16 }}>Save preferences</button>
    </form>
  );
}
