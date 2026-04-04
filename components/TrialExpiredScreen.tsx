"use client";

import Link from "next/link";
import { Lock, Crown, MessageCircle } from "lucide-react";

interface Props {
  cafeName: string;
  menuSlug: string;
}

export default function TrialExpiredScreen({ cafeName, menuSlug }: Props) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center space-y-6">

      {/* İkon */}
      <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center">
        <Lock className="w-9 h-9 text-orange-400" />
      </div>

      {/* Başlık */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900">Deneme süreniz doldu</h1>
        <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">
          30 günlük ücretsiz deneme süreniz sona erdi. Menünüz müşterilerinize açık kalmaya devam ediyor.
        </p>
      </div>

      {/* Fiyat kutusu */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl px-8 py-6 space-y-1 max-w-xs w-full">
        <div className="flex items-center justify-center gap-2 text-orange-500 font-bold text-sm mb-3">
          <Crown className="w-4 h-4" />
          Pro Plan
        </div>
        <p className="text-4xl font-extrabold text-gray-900">4.999₺</p>
        <p className="text-sm text-gray-400">yıllık · tüm özellikler dahil</p>
        <ul className="text-sm text-gray-500 space-y-1.5 mt-4 text-left">
          {[
            "Sınırsız ürün ve kategori",
            "Özel tema ve QR kod",
            "Duyuru banner",
            "İstatistikler",
            "AR görselleştirme (yakında)",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Satın al butonu */}
      <Link
        href="/upgrade"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-10 py-4 rounded-2xl transition-all text-sm shadow-xl shadow-orange-200"
      >
        <Crown className="w-5 h-5" />
        Pro&apos;ya Geç — 4.999₺/yıl
      </Link>

      {/* WhatsApp */}
      <a
        href="https://wa.me/905XXXXXXXXX?text=Merhaba%2C%20Qef%20Pro%20plana%20ge%C3%A7mek%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Soru sormak için WhatsApp
      </a>

      {/* Menü linki */}
      <a
        href={`/menu/${menuSlug}`}
        target="_blank"
        className="text-sm text-gray-400 hover:text-orange-500 transition-colors underline underline-offset-2"
      >
        Müşteri menünüzü görüntüle →
      </a>

    </div>
  );
}
