"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/client";
import { Printer, QrCode, Loader2, RefreshCw } from "lucide-react";

interface QRItem {
  label: string;
  url: string;
  dataUrl: string;
}

export default function QRPrint() {
  const [slug, setSlug] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [tableCount, setTableCount] = useState(10);
  const [items, setItems] = useState<QRItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cafe } = await supabase
        .from("cafes").select("slug, name").eq("user_id", user.id).single();
      if (cafe) { setSlug(cafe.slug); setCafeName(cafe.name); }
      setLoading(false);
    }
    load();
  }, []);

  async function generate() {
    if (!slug) return;
    setGenerating(true);
    const base = `${window.location.origin}/menu/${slug}`;
    const results: QRItem[] = [];

    const dataUrl = await QRCode.toDataURL(base, { width: 280, margin: 2, color: { dark: "#1f2937", light: "#ffffff" } });

    for (let i = 1; i <= tableCount; i++) {
      results.push({ label: `Masa ${i}`, url: base, dataUrl });
    }

    setItems(results);
    setGenerating(false);
  }

  function handlePrint() {
    localStorage.setItem("qr_printed", "true");
    const win = window.open("", "_blank");
    if (!win) return;
    const html = `
      <!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${cafeName} — QR Kodlar</title>
      <style>
        body { margin: 0; font-family: sans-serif; background: #fff; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 20px; }
        .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 6px; break-inside: avoid; }
        .card img { width: 150px; height: 150px; }
        .cafe { font-size: 11px; color: #6b7280; letter-spacing: 0.05em; }
        .label { font-weight: 700; font-size: 15px; color: #1f2937; }
        .ad { font-size: 9px; color: #d1d5db; letter-spacing: 0.08em; margin-top: 2px; }
        .footer { text-align: center; padding: 12px; font-size: 10px; color: #d1d5db; letter-spacing: 0.05em; }
        @media print { @page { margin: 10mm; } }
      </style>
      </head><body>
      <div class="grid">
        ${items.map(item => `
          <div class="card">
            <span class="cafe">${cafeName}</span>
            <img src="${item.dataUrl}" alt="${item.label}" />
            <span class="label">${item.label}</span>
            <span class="ad">qef.app ile dijital menü oluştur</span>
          </div>
        `).join("")}
      </div>
      <div class="footer">qef.app ile oluşturuldu</div>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>
    `;
    win.document.write(html);
    win.document.close();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Ayarlar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">QR Kod Oluştur</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Masa sayısı</label>
            <input
              type="number"
              min={1}
              max={100}
              value={tableCount}
              onChange={(e) => setTableCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <button
            onClick={generate}
            disabled={generating || !slug}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors mt-5"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Oluştur
          </button>
        </div>
        <p className="text-xs text-gray-400">
          {tableCount} adet QR kod oluşturulacak. Hepsi aynı menüye yönlendirir, altında masa numarası yazar.
        </p>
      </div>

      {/* Yazdır butonu */}
      {items.length > 0 && (
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          Yazdır / PDF olarak kaydet
        </button>
      )}

      {/* QR Grid */}
      {items.length > 0 ? (
        <div id="qr-print-area" className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.dataUrl} alt={item.label} className="w-36 h-36" />
              <p className="text-[10px] text-gray-400">{cafeName}</p>
              <p className="font-bold text-sm text-gray-700">{item.label}</p>
              <p className="text-[9px] text-gray-200 tracking-wide">qef.app ile dijital menü oluştur</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-300">
          <QrCode className="w-12 h-12" />
          <p className="text-sm">Masa sayısını gir ve oluştur'a bas.</p>
        </div>
      )}

    </div>
  );
}
