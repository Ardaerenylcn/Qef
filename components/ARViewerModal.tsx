"use client";

import { useEffect, useRef } from "react";
import { X, Smartphone } from "lucide-react";

interface Props {
  modelUrl: string;
  productName: string;
  primaryColor: string;
  onClose: () => void;
}

export default function ARViewerModal({ modelUrl, productName, primaryColor, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Script zaten yüklendiyse tekrar yükleme
    const load = () => initViewer();

    if (document.querySelector("script[data-mv]")) {
      // Zaten yüklenmiş — kısa bekle, custom element register olsun
      setTimeout(initViewer, 100);
    } else {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
      script.setAttribute("data-mv", "true");
      script.onload = load;
      document.head.appendChild(script);
    }

    function initViewer() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const mv = document.createElement("model-viewer") as HTMLElement;
      mv.setAttribute("src", modelUrl);
      mv.setAttribute("alt", productName);
      mv.setAttribute("ar", "");
      mv.setAttribute("ar-modes", "scene-viewer quick-look webxr");
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("shadow-intensity", "1");
      mv.style.cssText = "width:100%;height:100%;background:#111;border-radius:24px;";

      const btn = document.createElement("button");
      btn.setAttribute("slot", "ar-button");
      btn.textContent = "📷 Masanda Gör";
      btn.style.cssText = `
        position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
        background:${primaryColor};color:white;border:none;border-radius:99px;
        padding:12px 32px;font-size:15px;font-weight:700;cursor:pointer;
        white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.3);
      `;

      mv.appendChild(btn);
      containerRef.current.appendChild(mv);
    }
  }, [modelUrl, productName, primaryColor]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <div>
          <p className="text-white font-semibold">{productName}</p>
          <p className="text-white/40 text-xs mt-0.5">3D Model</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Model viewer */}
      <div ref={containerRef} className="flex-1 px-4 pb-4" />

      {/* Hint */}
      <div className="shrink-0 px-4 pb-6 flex items-center gap-2 justify-center">
        <Smartphone className="w-4 h-4 text-white/30" />
        <p className="text-white/30 text-xs">
          Modeli döndür · AR için "Masanda Gör"e bas
        </p>
      </div>
    </div>
  );
}
