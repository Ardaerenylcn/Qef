"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { ArrowLeft, ScanLine, RotateCcw } from "lucide-react";

function ARViewer() {
  const params = useSearchParams();
  const router = useRouter();
  const src = params.get("src") ?? "";
  const name = decodeURIComponent(params.get("name") ?? "Ürün");
  const color = params.get("color") ?? "#f97316";
  const [ready, setReady] = useState(false);
  const mvRef = useRef<HTMLElement & { activateAR: () => void; canActivateAR: boolean } | null>(null);

  function handleAR() {
    mvRef.current?.activateAR();
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0a0a" }}>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <p className="text-white font-semibold text-base">{name}</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            {ready ? "Modeli döndürerek incele" : "Yükleniyor..."}
          </p>
        </div>
      </div>

      {/* Model Viewer */}
      <div className="flex-1 px-4 min-h-0">
        {ready && (
          // @ts-ignore
          <model-viewer
            ref={mvRef}
            src={src}
            alt={name}
            ar=""
            ar-modes="scene-viewer quick-look webxr"
            camera-controls=""
            auto-rotate=""
            shadow-intensity="1"
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              background: "#111",
              borderRadius: "20px",
            }}
          />
        )}
        {!ready && (
          <div className="w-full h-full rounded-[20px] flex items-center justify-center"
            style={{ background: "#111" }}>
            <RotateCcw className="w-8 h-8 animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
          </div>
        )}
      </div>

      {/* AR Butonu */}
      <div className="shrink-0 px-4 py-5">
        <button
          onClick={handleAR}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base text-white transition-all disabled:opacity-40"
          style={{ background: color }}
        >
          <ScanLine className="w-5 h-5" />
          Masanda Gör
        </button>
        <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
          iPhone → Safari · Android → Chrome ile aç
        </p>
      </div>
    </div>
  );
}

export default function ARPage() {
  return (
    <Suspense>
      <ARViewer />
    </Suspense>
  );
}
