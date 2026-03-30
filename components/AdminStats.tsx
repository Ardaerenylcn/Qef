"use client";

import { Eye, TrendingUp, Clock } from "lucide-react";

interface Props {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  dailyData: { date: string; count: number }[];
  peakHour: number;
  hourlyData: { hour: number; count: number }[];
}

const TR_DAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

function dayLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dateStr === today.toISOString().slice(0, 10)) return "Bug.";
  if (dateStr === yesterday.toISOString().slice(0, 10)) return "Dün";
  return TR_DAYS[d.getDay()];
}

export default function AdminStats({ todayCount, weekCount, monthCount, dailyData, peakHour, hourlyData }: Props) {
  const maxDaily = Math.max(...dailyData.map(d => d.count), 1);
  const maxHourly = Math.max(...hourlyData.map(h => h.count), 1);

  const statCards = [
    { label: "Bugün", value: todayCount, icon: <Eye className="w-4 h-4" /> },
    { label: "Bu Hafta", value: weekCount, icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Bu Ay", value: monthCount, icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Stat kartları */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center space-y-1">
            <div className="flex justify-center text-orange-400">{icon}</div>
            <p className="text-2xl font-bold text-gray-800">{value.toLocaleString("tr")}</p>
            <p className="text-[11px] text-gray-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* 7 günlük bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 mb-4">Son 7 Gün</p>
        <div className="flex items-end justify-between gap-1.5 h-28">
          {dailyData.map(({ date, count }) => (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400 font-medium">{count > 0 ? count : ""}</span>
              <div className="w-full rounded-t-lg transition-all" style={{
                height: `${Math.max((count / maxDaily) * 80, count > 0 ? 4 : 2)}px`,
                backgroundColor: count > 0 ? "#f97316" : "#f3f4f6",
              }} />
              <span className="text-[10px] text-gray-400">{dayLabel(date)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zirve saat */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500">Saatlik Dağılım</p>
          {monthCount > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-500 rounded-full px-2.5 py-1">
              <Clock className="w-3 h-3" />
              <span className="text-[11px] font-semibold">
                Zirve: {String(peakHour).padStart(2, "0")}:00–{String(peakHour + 1).padStart(2, "0")}:00
              </span>
            </div>
          )}
        </div>

        {monthCount === 0 ? (
          <p className="text-center text-xs text-gray-300 py-4">Henüz veri yok</p>
        ) : (
          <div className="flex items-end gap-px h-12">
            {hourlyData.map(({ hour, count }) => (
              <div
                key={hour}
                title={`${String(hour).padStart(2, "0")}:00 — ${count} ziyaret`}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${Math.max((count / maxHourly) * 44, count > 0 ? 3 : 1)}px`,
                  backgroundColor: hour === peakHour && count > 0 ? "#f97316" : count > 0 ? "#fdba74" : "#f3f4f6",
                }}
              />
            ))}
          </div>
        )}

        {/* Saat etiketleri: 0, 6, 12, 18, 23 */}
        {monthCount > 0 && (
          <div className="flex justify-between text-[9px] text-gray-300 px-0.5">
            {["00", "06", "12", "18", "23"].map(h => <span key={h}>{h}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
