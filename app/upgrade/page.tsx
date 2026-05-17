"use client";

import { Crown, Check, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/905377414699?text=Merhaba%2C%20Qef%20Pro%20plan%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

export default function UpgradePage() {
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
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-200 text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Bizimle İletişime Geçin
            </a>

            <p className="text-center text-xs text-gray-400">
              Mesaj atın, size hemen dönelim.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
