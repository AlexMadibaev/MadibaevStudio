import { ImageResponse } from "next/og";

export const alt = "Madibaev Graphic Studio — independent branding and digital design studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0b0b0c",
          color: "#f5f2ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 84,
            height: 84,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(100deg, #00a0e3, #e5097f 49%, #ffed00)",
            fontSize: 44,
            fontWeight: 800,
            color: "#0b0b0c",
          }}
        >
          M
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Madibaev Graphic Studio
          </div>
          <div style={{ fontSize: 30, color: "#aaa7a0", fontWeight: 500 }}>
            Independent branding &amp; digital design studio — Dushanbe, worldwide
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
