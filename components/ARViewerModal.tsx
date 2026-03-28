"use client";

import { useEffect, useRef, useState } from "react";
import { X, Smartphone, ScanLine } from "lucide-react";

interface Props {
  modelUrl: string;
  productName: string;
  primaryColor: string;
  onClose: () => void;
}

export default function ARViewerModal({ modelUrl, productName, primaryColor, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mvRef = useRef<HTMLElement | null>(null);
  const [arAvailable, setArAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function initViewer() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const mv = document.createElement("model-viewer") as HTMLElement & {
        activateAR: () => void;
        canActivateAR: boolean;
      };

      mv.setAttribute("src", modelUrl);
      mv.setAttribute("alt", productName);
      mv.setAttribute("ar", "");
      mv.setAttribute("ar-modes", "scene-viewer quick-look webxr");
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("shadow-intensity", "1");
      mv.setAttribute("loading", "eager");
      mv.style.cssText = "width:100%;height:100%;background:#111;border-radius:24px;--poster-color:#111;";

      mv.addEventListener("load", () => {
        setLoading(false);
        // AR desteklenip desteklenmediğini kontrol et
        setTimeout(() => {
          setArAvailable((mv as any).canActivateAR ?? false);
        }, 300);
      });

      mv.addEventListener("error", () => setLoading(false));

      mvRef.current = mv;
      containerRef.current.appendChild(mv);
    }

    if (document.querySelector("script[data-mv]")) {
      setTimeout(initViewer, 50);
    } else {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
      script.setAttribute("data-mv", "true");
      script.onload = () => setTimeout(initViewer, 100);
      document.head.appendChild(script);
    }

    return () => {
      mvRef.current = null;
    };
  }, [modelUrl, productName]);

  function handleAR() {
    const mv = mvRef.current as any;
    if (mv?.activateAR) mv.activateAR();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <div>
          <p className="text-white font-semibold">{productName}</p>
          <p className="text-white/40 text-xs mt-0.5">
            {loading ? "Model yükleniyor..." : "3D Model · Döndürerek incele"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Model viewer */}
      <div ref={containerRef} className="flex-1 px-4" />

      {/* AR Butonu */}
      <div className="shrink-0 px-4 py-5 space-y-3">
        {arAvailable === false && (
          <p className="text-center text-xs text-white/30 flex items-center justify-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            Bu cihaz/tarayıcı AR desteklemiyor · iPhone → Safari, Android → Chrome
          </p>
        )}
        <button
          onClick={handleAR}
          disabled={arAvailable === false}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-30"
          style={{ backgroundColor: arAvailable === false ? "#333" : primaryColor, color: "white" }}
        >
          <ScanLine className="w-5 h-5" />
          Masanda Gör
        </button>
      </div>
    </div>
  );
}
