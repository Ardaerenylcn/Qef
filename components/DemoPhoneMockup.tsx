"use client";

export default function DemoPhoneMockup() {
  return (
    <div className="flex-shrink-0 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />

        {/* Telefon çerçevesi */}
        <div className="relative w-[270px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />

          {/* Ekran */}
          <div className="relative rounded-[32px] overflow-hidden bg-white" style={{ height: 560 }}>
            {/* iframe — her cihazda gösterilir */}
            <iframe
              src="/menu/demo"
              className="w-full h-full border-0"
              title="Demo Menü"
            />

            {/* Mobilde dokunma engelleyici overlay */}
            <a
              href="/menu/demo"
              target="_blank"
              className="md:hidden absolute inset-0 flex flex-col items-center justify-end pb-8 gap-2"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }}
            >
              <span className="bg-white text-gray-800 font-bold text-sm px-5 py-2.5 rounded-full shadow-lg">
                Demo'yu aç →
              </span>
            </a>
          </div>

          <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
