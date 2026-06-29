import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SpyderNetwork – Live Lake of the Ozarks Web Cams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1526 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle red glow behind logo */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(204,0,0,0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://spydern3twork.netlify.app/images/SpyderLogo.png"
          alt="SpyderNetwork"
          width={520}
          height={152}
          style={{ objectFit: "contain" }}
        />

        {/* Tagline */}
        <div
          style={{
            marginTop: "32px",
            color: "#9ca3af",
            fontSize: "22px",
            fontFamily: "sans-serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Live Lake of the Ozarks Web Cams
        </div>

        {/* Bottom red accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #cc0000 20%, #cc0000 80%, transparent)",
          }}
        />

        {/* Top cyan accent bar */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #00d4ff 20%, #00d4ff 80%, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
