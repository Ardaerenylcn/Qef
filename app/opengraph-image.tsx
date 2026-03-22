import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Qef — Kafen için ücretsiz dijital QR menü";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Dekoratif çember - sol üst */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(249,115,22,0.08)",
            display: "flex",
          }}
        />
        {/* Dekoratif çember - sağ alt */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(249,115,22,0.06)",
            display: "flex",
          }}
        />

        {/* İkon */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#f97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            boxShadow: "0 20px 40px rgba(249,115,22,0.35)",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="white"/>
            <rect x="14" y="3" width="7" height="7" rx="1" fill="white"/>
            <rect x="3" y="14" width="7" height="7" rx="1" fill="white"/>
            <rect x="5" y="5" width="3" height="3" fill="#f97316"/>
            <rect x="16" y="5" width="3" height="3" fill="#f97316"/>
            <rect x="5" y="16" width="3" height="3" fill="#f97316"/>
            <rect x="14" y="14" width="3" height="3" fill="white"/>
            <rect x="18" y="14" width="3" height="3" fill="white"/>
            <rect x="14" y="18" width="3" height="3" fill="white"/>
            <rect x="18" y="18" width="3" height="3" fill="white"/>
          </svg>
        </div>

        {/* Logo yazısı */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: 20,
            display: "flex",
          }}
        >
          Qef
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#6b7280",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 640,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Kafen için ücretsiz dijital QR menü
        </div>

        {/* Alt badge */}
        <div
          style={{
            marginTop: 48,
            padding: "12px 28px",
            borderRadius: 999,
            background: "#f97316",
            color: "white",
            fontSize: 20,
            fontWeight: 600,
            display: "flex",
          }}
        >
          qef-sepia.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
