import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <span
          style={{
            fontSize: 20,
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
