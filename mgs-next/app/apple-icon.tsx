import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(100deg, #00a0e3, #e5097f 49%, #ffed00)",
        }}
      >
        <span
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: "#0b0b0c",
            letterSpacing: "-0.03em",
          }}
        >
          M
        </span>
      </div>
    ),
    { ...size },
  );
}
