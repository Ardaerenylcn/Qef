"use client";

import { useState } from "react";
import { Crown, Loader2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/iyzico/checkout", { method: "POST" });
      let data: Record<string, unknown> = {};
      try { data = await res.json(); } catch { /* HTML error page */ }
      if (!res.ok || !data.checkoutFormContent) {
        const debugStr = data.debug ? ` | DBG: ${JSON.stringify(data.debug)}` : "";
        setError(`Ödeme sayfası açılamadı: ${data.detail ?? data.error ?? `HTTP ${res.status}`}${debugStr}`);
        setLoading(false);
        return;
      }
      // iyzico form HTML'ini sayfaya enjekte et ve submit et
      const div = document.createElement("div");
      div.innerHTML = data.checkoutFormContent as string;
      document.body.appendChild(div);
      const form = div.querySelector("form");
      if (form) form.submit();
      else setError("Ödeme formu yüklenemedi.");
    } catch (e) {
      setError(`Bir hata oluştu: ${String(e)}`);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6">

        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Admin paneline dön
        </Link>

        <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-xl shadow-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-white" />
            <span className="text-white font-bold">Qef Pro Plan</span>
          </div>

          <div className="px-8 py-8 space-y-6">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-gray-900">4.999₺</span>
                <span className="text-gray-400 mb-1.5">/yıl</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Aylığa vurulunca ~416₺ · KDV dahil</p>
            </div>

            <ul className="space-y-3">
              {[
                "Sınırsız ürün ve kategori",
                "Özel tema — renkler, logo, kapak görseli",
                "Türkçe & İngilizce menü",
                "QR kod oluşturma ve indirme",
                "Duyuru banner sistemi",
                "Ziyaret istatistikleri",
                "AR görselleştirme (yakında)",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {error && (
              <p className="text-sm text-red-400 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
              {loading ? "Yönlendiriliyor..." : "Şimdi Satın Al"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Güvenli ödeme · iyzico altyapısı
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
