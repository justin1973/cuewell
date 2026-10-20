import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cuewell — find people already looking for what you sell";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%", width: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "80px",
          background: "#0A0A0B", color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 44 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "#6366F1" }} />
          <div style={{ fontSize: 36, fontWeight: 700 }}>Cuewell</div>
        </div>
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.08, maxWidth: 940 }}>
          Find people already looking for what you sell.
        </div>
        <div style={{ fontSize: 28, color: "#9A9DA4", marginTop: 30, maxWidth: 900 }}>
          AI reads public conversations and brings you the ready-to-buy ones — scored by intent.
        </div>
      </div>
    ),
    { ...size },
  );
}
