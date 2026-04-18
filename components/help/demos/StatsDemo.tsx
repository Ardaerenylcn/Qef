"use client";

import { useEffect, useState } from "react";

const DATA = [
  { day: "Pt", v: 38 }, { day: "Sa", v: 61 }, { day: "Ça", v: 44 },
  { day: "Pe", v: 75 }, { day: "Cu", v: 92 }, { day: "Ct", v: 67 },
  { day: "Pz", v: 48 },
];

export default function StatsDemo() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const run = () => { setOn(false); setTimeout(() => setOn(true), 120); };
    run();
    const id = setInterval(run, 3600);
    return () => clearInterval(id);
  }, []);

  const max = Math.max(...DATA.map((d) => d.v));

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-xs font-semibold text-gray-500 mb-4">Son 7 gün görüntüleme</p>
      <div className="flex items-end gap-2 h-28">
        {DATA.map((d, i) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full relative flex items-end" style={{ height: "100%" }}>
              <div className="w-full bg-orange-50 rounded-t-lg h-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ease-out"
                  style={{
                    height: on ? `${(d.v / max) * 100}%` : "0%",
                    background: i === 4
                      ? "linear-gradient(to top, #ea580c, #f97316)"
                      : "linear-gradient(to top, #fed7aa, #fdba74)",
                    transitionDelay: `${i * 55}ms`,
                  }}
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{d.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-base font-bold text-gray-800">{DATA[DATA.length - 1].v}</p>
          <p className="text-[10px] text-gray-400">Bugün</p>
        </div>
        <div>
          <p className="text-base font-bold text-orange-500">{DATA.reduce((s, d) => s + d.v, 0)}</p>
          <p className="text-[10px] text-gray-400">Bu hafta</p>
        </div>
        <div>
          <p className="text-base font-bold text-gray-800">1.4K</p>
          <p className="text-[10px] text-gray-400">Bu ay</p>
        </div>
      </div>
    </div>
  );
}
