import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Escape a value for CSV (wrap in quotes, double any inner quotes).
function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect("/login");

  const { data: leads } = await supabase
    .from("leads")
    .select("created_at, source, score, title, excerpt, reason, labels, status, url")
    .order("created_at", { ascending: false })
    .limit(5000);

  const header = ["Date", "Source", "Score", "Title", "Excerpt", "Why", "Labels", "Status", "URL"];
  const rows = (leads ?? []).map((l) => [
    new Date(l.created_at as string).toISOString(),
    l.source,
    l.score,
    l.title,
    l.excerpt,
    l.reason,
    (l.labels ?? []).join(" | "),
    l.status,
    l.url,
  ].map(cell).join(","));

  const csv = [header.map(cell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cuewell-leads-${stamp}.csv"`,
    },
  });
}
