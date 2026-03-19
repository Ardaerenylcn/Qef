"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function LangToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") ?? "tr";

  function setLang(l: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", l);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 bg-black/10 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => setLang("tr")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "tr" ? "bg-white text-gray-800 shadow-sm" : "text-white/70 hover:text-white"
        }`}
      >
        TR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "en" ? "bg-white text-gray-800 shadow-sm" : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
