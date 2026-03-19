"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { X, Download, QrCode } from "lucide-react";

interface Props {
  slug: string;
  cafeName: string;
  onClose: () => void;
}

export default function QRCodeModal({ slug, cafeName, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const menuUrl = `${window.location.origin}/menu/${slug}`;
    setUrl(menuUrl);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, menuUrl, {
        width: 280,
        margin: 2,
        color: { dark: "#1f2937", light: "#ffffff" },
      });
    }
  }, [slug]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Kafe adıyla birlikte daha büyük bir canvas oluştur
    const padding = 24;
    const labelHeight = 48;
    const output = document.createElement("canvas");
    output.width = canvas.width + padding * 2;
    output.height = canvas.height + padding * 2 + labelHeight;

    const ctx = output.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, output.width, output.height);

    // QR kodu ortaya yerleştir
    ctx.drawImage(canvas, padding, padding);

    // Alt kısma kafe adı yaz
    ctx.fillStyle = "#f97316";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(cafeName, output.width / 2, canvas.height + padding + 20);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px sans-serif";
    ctx.fillText(url, output.width / 2, canvas.height + padding + 38);

    const link = document.createElement("a");
    link.download = `${slug}-qr-menu.png`;
    link.href = output.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 space-y-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-orange-400" />
            <h2 className="font-semibold text-gray-800">QR Kod</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Canvas */}
        <div className="flex justify-center bg-gray-50 rounded-xl p-4">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* URL */}
        <div className="bg-orange-50 rounded-lg px-3 py-2">
          <p className="text-xs text-orange-400 font-medium break-all text-center">{url}</p>
        </div>

        {/* İndir butonu */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          PNG olarak indir
        </button>
      </div>
    </div>
  );
}
