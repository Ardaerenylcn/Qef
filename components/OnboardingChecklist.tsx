"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle2, Circle, X, ChevronRight } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  bubble: string;
  done: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface Props {
  cafe: { id: string; name: string; slug: string };
  categories: string[];
  products: { id: string }[];
  onSwitchTab: (tab: "menu" | "theme" | "qr") => void;
  onClose: () => void;
}

export default function OnboardingChecklist({ cafe, categories, products, onSwitchTab, onClose }: Props) {
  const [qrPrinted, setQrPrinted] = useState(false);
  const [waving, setWaving] = useState(true);
  const [prevCompleted, setPrevCompleted] = useState(0);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrPrinted(localStorage.getItem("qr_printed") === "true");
    // İlk açılışta wave
    const t = setTimeout(() => setWaving(false), 1300);
    return () => clearTimeout(t);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function triggerWave() {
    setWaving(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setWaving(true));
    });
    setTimeout(() => setWaving(false), 1300);
  }

  const isDefaultSlug = !cafe.slug || /^[0-9a-f-]{36}$/.test(cafe.slug);

  const steps: Step[] = [
    {
      id: "cafe-name",
      title: "Kafe adını ve açıklamasını belirle",
      description:
        "Müşterilerin menüye girdiğinde ilk göreceği şey kafe adın. Güzel bir isim ve kısa bir açıklama eklemek güven verir, menüye profesyonel bir görünüm kazandırır.",
      bubble: "Merhaba! Önce kafeye bir isim verelim 👋",
      done: !!(cafe.name && cafe.name !== "Kafem"),
      actionLabel: "Kafe bilgilerine git",
      onAction: () => scrollTo("cafe-info-section"),
    },
    {
      id: "slug",
      title: "Menü linkini özelleştir",
      description:
        "qefmenu.com/menu/kafe-adiniz formatında kısa ve akılda kalıcı bir link belirle. Bu link QR kodunun içine gömülecek, müşterilerin seni bu linkle bulacak. Sonradan değiştirebilirsin ama QR kodunu yeniden oluşturman gerekir.",
      bubble: "Harika! Şimdi menü linkini özelleştirelim 🔗",
      done: !isDefaultSlug,
      actionLabel: "Linki güncelle",
      onAction: () => scrollTo("cafe-info-section"),
    },
    {
      id: "categories",
      title: "Kategorilerini oluştur",
      description:
        "Menünü düzenlemek için önce kategorileri oluştur. Örneğin: Kahveler, Soğuk İçecekler, Tatlılar, Ana Yemekler. Kategoriler menüde sekme olarak görünür, müşteriler istediği bölüme hızla geçebilir.",
      bubble: "Süper! Sıra kategorileri oluşturmaya geldi 📂",
      done: categories.length > 0,
      actionLabel: "Kategori ekle",
      onAction: () => scrollTo("categories-section"),
    },
    {
      id: "product",
      title: "İlk ürününü ekle",
      description:
        "Kategorilerini oluşturduktan sonra ürünleri eklemeye başlayabilirsin. Her ürüne fiyat, açıklama ve fotoğraf ekleyebilirsin. Fotoğraflı ürünler müşterilerin dikkatini çeker ve sipariş kararını kolaylaştırır.",
      bubble: "Neredeyse bitti! İlk ürününü ekleyelim 🍽️",
      done: products.length > 0,
      actionLabel: "Ürün ekle",
      onAction: () => scrollTo("add-product-section"),
    },
    {
      id: "qr",
      title: "QR kodunu oluştur ve masana yapıştır",
      description:
        "Menün hazır! Son adım: QR kodlarını oluştur, yazdır ve masalara yapıştır. Müşterilerin telefonlarının kamerasıyla okutarak menüne anında erişebilir. Kurulum gerektirmez, uygulama indirmek gerekmez.",
      bubble: "Son adım! QR kodlarını oluşturalım 📱",
      done: qrPrinted,
      actionLabel: "QR kodlarına git",
      onAction: () => onSwitchTab("qr"),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const activeStep = steps.find((s) => !s.done);
  const bubbleText = allDone
    ? "Menün hazır! Müşterilerini bekliyorsun 🎉"
    : activeStep?.bubble ?? "";

  // Adım tamamlandığında wave tetikle
  useEffect(() => {
    if (completedCount > prevCompleted) {
      triggerWave();
      setPrevCompleted(completedCount);
    }
  }, [completedCount]);

  // Tüm adımlar tamamlanınca 3 saniye sonra otomatik kapat
  useEffect(() => {
    if (!allDone) return;
    const t = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(t);
  }, [allDone]);

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      {/* Üst bölüm — maskot + başlık */}
      <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 px-6 pt-5 pb-4 flex items-end justify-between gap-4">
        <div className="flex-1 space-y-1 pb-1">
          <h2 className="font-bold text-gray-800 text-base">
            {allDone ? "Menün hazır! 🎉" : "Menüne hazırlan"}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {allDone
              ? "Tüm adımları tamamladın. Müşterilerin artık menüne erişebilir."
              : `${completedCount} / ${steps.length} adım tamamlandı — aşağıdaki adımları sırayla izle`}
          </p>
          {/* Progress bar */}
          <div className="w-full bg-orange-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-orange-400 h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Maskot + konuşma balonu */}
        <div className="relative shrink-0 flex flex-col items-center" ref={mascotRef}>
          {/* Konuşma balonu */}
          <div
            key={bubbleText}
            className="bubble-pop absolute -top-1 right-full mr-2 w-44 bg-white border border-orange-100 shadow-md rounded-xl px-3 py-2 text-xs text-gray-600 leading-relaxed"
          >
            {bubbleText}
            {/* Balonu sağa bağlayan kuyruk */}
            <span className="absolute right-[-7px] top-4 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "7px solid white",
                filter: "drop-shadow(1px 0 0 #fed7aa)",
              }}
            />
          </div>

          {/* Maskot */}
          <div
            className={waving ? "mascot-wave" : "mascot-float"}
            onClick={triggerWave}
            style={{ cursor: "pointer" }}
            title="Tıkla 👋"
          >
            <Image
              src="/mascot.png"
              alt="Maskot"
              width={90}
              height={90}
              className="w-20 h-20 object-contain select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Kapat butonu */}
        <button
          onClick={onClose}
          title="Kapat"
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Adımlar */}
      <div className="px-6 py-4 divide-y divide-gray-50">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex gap-3 py-3.5 first:pt-0 last:pb-0 transition-opacity duration-300 ${step.done ? "opacity-40" : ""}`}
          >
            <div className="shrink-0 mt-0.5">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-orange-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-200" />
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <p className={`text-sm font-medium leading-snug ${step.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                {step.title}
              </p>
              {!step.done && (
                <>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
                  {step.onAction && (
                    <button
                      onClick={step.onAction}
                      className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors mt-0.5"
                    >
                      {step.actionLabel}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
