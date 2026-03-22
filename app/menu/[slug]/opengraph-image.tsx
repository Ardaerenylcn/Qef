import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("name, description, theme")
    .eq("slug", slug)
    .single();

  const name = cafe?.name ?? "Dijital Menü";
  const desc = cafe?.description ?? "";
  const primaryColor: string = (cafe?.theme as { primaryColor?: string } | null)?.primaryColor ?? "#f97316";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Üst renkli şerit */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: primaryColor,
            display: "flex",
          }}
        />

        {/* Arka plan dekorasyon */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `${primaryColor}12`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: `${primaryColor}0a`,
            display: "flex",
          }}
        />

        {/* İçerik */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "0 100px",
          }}
        >
          {/* Menü etiketi */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: primaryColor,
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: 20,
              display: "flex",
            }}
          >
            MENÜ
          </div>

          {/* Kafe adı */}
          <div
            style={{
              fontSize: name.length > 20 ? 64 : 80,
              fontWeight: 900,
              color: "#111827",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: desc ? 24 : 0,
              maxWidth: 800,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {name}
          </div>

          {/* Açıklama */}
          {desc && (
            <div
              style={{
                fontSize: 26,
                color: "#6b7280",
                maxWidth: 700,
                lineHeight: 1.5,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {desc.length > 80 ? desc.slice(0, 80) + "…" : desc}
            </div>
          )}
        </div>

        {/* Alt bar */}
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 100px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: primaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white"/>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white"/>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white"/>
                <rect x="5" y="5" width="3" height="3" fill={primaryColor}/>
                <rect x="16" y="5" width="3" height="3" fill={primaryColor}/>
                <rect x="5" y="16" width="3" height="3" fill={primaryColor}/>
                <rect x="14" y="14" width="3" height="3" fill="white"/>
                <rect x="18" y="14" width="3" height="3" fill="white"/>
                <rect x="14" y="18" width="3" height="3" fill="white"/>
                <rect x="18" y="18" width="3" height="3" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#111827", display: "flex" }}>Qef</span>
          </div>
          <span style={{ fontSize: 18, color: "#9ca3af", display: "flex" }}>
            qef-sepia.vercel.app/menu/{slug}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
