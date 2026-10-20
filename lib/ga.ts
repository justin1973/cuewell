import crypto from "crypto";

// Reads live stats from the Google Analytics Data API (GA4), server-side only.
// Uses a service-account JWT → access token, with no external npm dependency.
// Returns null if not configured or if the call fails, so the admin degrades gracefully.

export type GaStats = {
  users7: number; users30: number;
  views7: number; views30: number; viewsToday: number;
  chart: { label: string; n: number }[];
  topPages: { path: string; views: number }[];
};

function b64url(input: string): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(): Promise<string | null> {
  const email = process.env.GA_CLIENT_EMAIL;
  let key = process.env.GA_PRIVATE_KEY;
  if (!email || !key) return null;
  key = key.replace(/\\n/g, "\n"); // restore newlines if stored escaped

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;

  let signature: string;
  try {
    signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(key)
      .toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  } catch {
    return null;
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsigned}.${signature}`,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.access_token as string) ?? null;
  } catch {
    return null;
  }
}

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };

async function runReport(token: string, body: unknown): Promise<{ rows?: GaRow[] } | null> {
  const pid = process.env.GA_PROPERTY_ID;
  if (!pid) return null;
  try {
    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getGaStats(): Promise<GaStats | null> {
  if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) return null;
  const token = await getAccessToken();
  if (!token) return null;

  const [summary, trend, top] = await Promise.all([
    runReport(token, {
      dateRanges: [{ startDate: "6daysAgo", endDate: "today" }, { startDate: "29daysAgo", endDate: "today" }],
      metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
    }),
    runReport(token, {
      dateRanges: [{ startDate: "13daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
    runReport(token, {
      dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 5,
    }),
  ]);

  if (!summary || !trend) return null;

  let users7 = 0, views7 = 0, users30 = 0, views30 = 0;
  for (const r of summary.rows ?? []) {
    const dr = r.dimensionValues?.[0]?.value;
    const u = Number(r.metricValues?.[0]?.value ?? 0);
    const v = Number(r.metricValues?.[1]?.value ?? 0);
    if (dr === "date_range_0") { users7 = u; views7 = v; }
    else if (dr === "date_range_1") { users30 = u; views30 = v; }
  }

  const trendMap = new Map<string, number>();
  for (const r of trend.rows ?? []) {
    const d = r.dimensionValues?.[0]?.value;
    if (d) trendMap.set(d, Number(r.metricValues?.[0]?.value ?? 0));
  }
  const chart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    return { label: String(d.getDate()), n: trendMap.get(key) ?? 0 };
  });
  const viewsToday = chart[chart.length - 1].n;

  const topPages = (top?.rows ?? []).map((r) => ({
    path: r.dimensionValues?.[0]?.value ?? "/",
    views: Number(r.metricValues?.[0]?.value ?? 0),
  }));

  return { users7, users30, views7, views30, viewsToday, chart, topPages };
}
