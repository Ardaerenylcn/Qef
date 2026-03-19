"use client";

import { useState } from "react";
import { UtensilsCrossed, Palette } from "lucide-react";
import MenuEditor from "./MenuEditor";
import ThemeEditor from "./ThemeEditor";

export default function AdminTabs() {
  const [tab, setTab] = useState<"menu" | "theme">("menu");

  return (
    <div className="space-y-6">
      {/* Sekme butonları */}
      <div className="flex gap-2 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        <button
          onClick={() => setTab("menu")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "menu"
              ? "bg-orange-500 text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Menü
        </button>
        <button
          onClick={() => setTab("theme")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "theme"
              ? "bg-orange-500 text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Palette className="w-4 h-4" />
          Görünüm
        </button>
      </div>

      {tab === "menu" ? <MenuEditor /> : <ThemeEditor />}
    </div>
  );
}
