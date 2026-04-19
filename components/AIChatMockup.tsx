"use client";

import { useEffect, useState } from "react";
import { Bot, User } from "lucide-react";

const CONVERSATION = [
  { role: "user", text: "Hafif bir şeyler yemek istiyorum, ne önerirsin?" },
  { role: "ai", text: "Tavuk Salata'yı deneyebilirsiniz — taze sebzeler ve ızgara tavukla hem doyurucu hem hafif. 🥗" },
  { role: "user", text: "Glutensiz seçenek var mı?" },
  { role: "ai", text: "Evet! Mercimek Çorbası ve Izgara Somon glutensiz. İkisi de çok tercih edilen ürünlerimizden. ✨" },
];

export default function AIChatMockup() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visibleCount >= CONVERSATION.length) {
      const reset = setTimeout(() => setVisibleCount(0), 3000);
      return () => clearTimeout(reset);
    }

    const next = CONVERSATION[visibleCount];
    if (!next) return;

    if (next.role === "ai") {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setVisibleCount((v) => v + 1);
      }, 1400);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setVisibleCount((v) => v + 1), 900);
      return () => clearTimeout(t);
    }
  }, [visibleCount]);

  const messages = CONVERSATION.slice(0, visibleCount);

  return (
    <div className="relative w-full lg:w-[52%] flex-shrink-0 flex items-center justify-center">

      {/* Arka plan glow — overflow-visible kalması için ayrı container */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute w-72 h-72 bg-orange-500/20 rounded-full blur-[80px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-48 h-48 bg-yellow-400/10 rounded-full blur-[60px] left-1/2 top-1/2 -translate-x-1/3 translate-y-8" />
      </div>

      {/* Yüzen rozetler */}
      <div className="absolute -top-4 -right-2 lg:right-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-3 py-2 text-xs text-white font-semibold shadow-xl animate-bounce" style={{ animationDuration: "3s" }}>
        🤖 7/24 aktif
      </div>
      <div className="absolute -bottom-4 -left-2 lg:left-4 bg-orange-500/20 backdrop-blur border border-orange-400/30 rounded-2xl px-3 py-2 text-xs text-orange-300 font-semibold shadow-xl animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
        ⚡ Anlık yanıt
      </div>

      {/* Chat penceresi */}
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-gray-900/80 backdrop-blur">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/10 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Menü Asistanı</p>
            <p className="text-orange-300 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Çevrimiçi
            </p>
          </div>
        </div>

        {/* Mesajlar */}
        <div className="px-4 py-5 space-y-3 min-h-[280px] flex flex-col justify-end">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed animate-fadeIn ${
                m.role === "user"
                  ? "bg-orange-500 text-white rounded-br-sm"
                  : "bg-white/10 text-slate-200 rounded-bl-sm border border-white/10"
              }`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2 justify-start animate-fadeIn">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input alanı */}
        <div className="px-4 pb-5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <p className="flex-1 text-slate-500 text-[13px]">Bir şeyler sorun...</p>
            <div className="w-7 h-7 rounded-xl bg-orange-500/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
