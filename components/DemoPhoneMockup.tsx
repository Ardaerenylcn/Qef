"use client";

export default function DemoPhoneMockup() {
  return (
    <div className="flex-shrink-0 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />
        <div className="relative w-[270px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
          <div
            className="rounded-[32px] overflow-hidden bg-white"
            style={{ height: 560, touchAction: "pan-y", overscrollBehavior: "none" }}
          >
            <iframe
              src="/menu/demo"
              className="w-full h-full border-0"
              title="Demo Menü"
              style={{ touchAction: "pan-y" }}
            />
          </div>
          <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
