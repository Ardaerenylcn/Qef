"use client";

import { useState } from "react";
import { UtensilsCrossed, Palette, QrCode, BarChart2, Settings, Sparkles } from "lucide-react";
import MenuEditor from "./MenuEditor";
import ThemeEditor from "./ThemeEditor";
import QRPrint from "./QRPrint";
import AdminStats from "./AdminStats";
import AccountSettings from "./AccountSettings";
import BulkAIScan from "./BulkAIScan";

type Tab = "menu" | "theme" | "qr" | "stats" | "settings" | "ai";

interface Props {
  email: string;
  cafeId: string;
  cafeSlug: string;
  existingCategories: string[];
  chatbotEnabled: boolean;
  seasonalThemesEnabled: boolean;
  aiScanCount: number;
  aiScanLimit: number;
  stats: {
    todayCount: number;
    weekCount: number;
    monthCount: number;
    dailyData: { date: string; count: number }[];
    peakHour: number;
    hourlyData: { hour: number; count: number }[];
  };
}

export default function AdminTabs({ email, cafeId, cafeSlug, existingCategories, chatbotEnabled, seasonalThemesEnabled, aiScanCount, aiScanLimit, stats }: Props) {
  const [tab, setTab] = useState<Tab>("menu");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "menu",     label: "Menü",        icon: <UtensilsCrossed className="w-4 h-4" /> },
    { key: "ai",       label: "Toplu Ürün",  icon: <Sparkles className="w-4 h-4" /> },
    { key: "theme",    label: "Görünüm",     icon: <Palette className="w-4 h-4" /> },
    { key: "qr",       label: "QR Kodlar",   icon: <QrCode className="w-4 h-4" /> },
    { key: "stats",    label: "İstatistik",  icon: <BarChart2 className="w-4 h-4" /> },
    { key: "settings", label: "Ayarlar",     icon: <Settings className="w-4 h-4" /> },
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

      {tab === "menu"     && <MenuEditor onSwitchTab={setTab} />}
      {tab === "ai"       && <BulkAIScan cafeId={cafeId} cafeSlug={cafeSlug} existingCategories={existingCategories} initialScanCount={aiScanCount} scanLimit={aiScanLimit} />}
      {tab === "theme"    && <ThemeEditor />}
      {tab === "qr"       && <QRPrint />}
      {tab === "stats"    && <AdminStats {...stats} />}
      {tab === "settings" && <AccountSettings email={email} cafeId={cafeId} chatbotEnabled={chatbotEnabled} seasonalThemesEnabled={seasonalThemesEnabled} />}
    </div>
  );
}
