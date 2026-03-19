"use client";

import { DEFAULT_HOURS, DAY_NAMES, type OpeningHour } from "@/types/menu";

interface Props {
  value: OpeningHour[];
  onChange: (hours: OpeningHour[]) => void;
}

export default function OpeningHoursEditor({ value, onChange }: Props) {
  // Fill missing days from DEFAULT_HOURS
  const hours: OpeningHour[] = DEFAULT_HOURS.map((def) => {
    const existing = value.find((h) => h.day === def.day);
    return existing ?? def;
  });

  function updateHour(day: number, patch: Partial<OpeningHour>) {
    const updated = hours.map((h) =>
      h.day === day ? { ...h, ...patch } : h
    );
    onChange(updated);
  }

  return (
    <div className="space-y-2">
      {hours.map((hour) => (
        <div key={hour.day} className="flex items-center gap-2 text-sm">
          <span className="w-24 shrink-0 text-xs font-medium text-gray-600">
            {DAY_NAMES[hour.day]}
          </span>
          <button
            type="button"
            onClick={() => updateHour(hour.day, { closed: !hour.closed })}
            className={`text-xs px-2 py-1 rounded-lg border transition-colors shrink-0 ${
              hour.closed
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-green-50 border-green-200 text-green-600"
            }`}
          >
            {hour.closed ? "Kapalı" : "Açık"}
          </button>
          <input
            type="time"
            value={hour.open}
            disabled={hour.closed}
            onChange={(e) => updateHour(hour.day, { open: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-30 disabled:bg-gray-50 w-24"
          />
          <span className="text-gray-300 text-xs">–</span>
          <input
            type="time"
            value={hour.close}
            disabled={hour.closed}
            onChange={(e) => updateHour(hour.day, { close: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-30 disabled:bg-gray-50 w-24"
          />
        </div>
      ))}
    </div>
  );
}
