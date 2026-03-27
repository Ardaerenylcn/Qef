"use client";

import { useState } from "react";
import { UtensilsCrossed, Palette, QrCode } from "lucide-react";
import MenuEditor from "./MenuEditor";
import ThemeEditor from "./ThemeEditor";
import QRPrint from "./QRPrint";

type Tab = "menu" | "theme" | "qr";

export default function AdminTabs() {
  const [tab, setTab] = useState<Tab>("menu");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "menu",  label: "Menü",     icon: <UtensilsCrossed className="w-4 h-4" /> },
    { key: "theme", label: "Görünüm",  icon: <Palette className="w-4 h-4" /> },
    { key: "qr",    label: "QR Kodlar", icon: <QrCode className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1.5 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === "menu" && <MenuEditor onSwitchTab={setTab} />}
      {tab === "theme" && <ThemeEditor />}
      {tab === "qr" && <QRPrint />}
    </div>
  );
}
