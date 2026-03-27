"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, X, ChevronRight, Rocket } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  done: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface Props {
  cafe: { id: string; name: string; slug: string };
  categories: string[];
  products: { id: string }[];
  onSwitchTab: (tab: "menu" | "theme" | "qr") => void;
}

export default function OnboardingChecklist({ cafe, categories, products, onSwitchTab }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [qrPrinted, setQrPrinted] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem("onboarding_dismissed") === "true");
    setQrPrinted(localStorage.getItem("qr_printed") === "true");
  }, []);

  function dismiss() {
    localStorage.setItem("onboarding_dismissed", "true");
    setDismissed(true);
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const isDefaultSlug = !cafe.slug || /^[0-9a-f-]{36}$/.test(cafe.slug);

  const steps: Step[] = [
    {
      id: "cafe-name",
      title: "Kafe adını ve açıklamasını belirle",
      description:
        "Müşterilerin menüye girdiğinde ilk göreceği şey kafe adın. Güzel bir isim ve kısa bir açıklama eklemek güven verir, menüye profesyonel bir görünüm kazandırır.",
      done: !!(cafe.name && cafe.name !== "Kafem"),
      actionLabel: "Kafe bilgilerine git",
      onAction: () => scrollTo("cafe-info-section"),
    },
    {
      id: "slug",
      title: "Menü linkini özelleştir",
      description:
        "qefmenu.com/menu/kafe-adiniz formatında kısa ve akılda kalıcı bir link belirle. Bu link QR kodunun içine gömülecek, müşterilerin seni bu linkle bulacak. Sonradan değiştirebilirsin ama QR kodunu yeniden oluşturman gerekir.",
      done: !isDefaultSlug,
      actionLabel: "Linki güncelle",
      onAction: () => scrollTo("cafe-info-section"),
    },
    {
      id: "categories",
      title: "Kategorilerini oluştur",
      description:
        "Menünü düzenlemek için önce kategorileri oluştur. Örneğin: Kahveler, Soğuk İçecekler, Tatlılar, Ana Yemekler. Kategoriler menüde sekme olarak görünür, müşteriler istediği bölüme hızla geçebilir.",
      done: categories.length > 0,
      actionLabel: "Kategori ekle",
      onAction: () => scrollTo("categories-section"),
    },
    {
      id: "product",
      title: "İlk ürününü ekle",
      description:
        "Kategorilerini oluşturduktan sonra ürünleri eklemeye başlayabilirsin. Her ürüne fiyat, açıklama ve fotoğraf ekleyebilirsin. Fotoğraflı ürünler müşterilerin dikkatini çeker ve sipariş kararını kolaylaştırır.",
      done: products.length > 0,
      actionLabel: "Ürün ekle",
      onAction: () => scrollTo("add-product-section"),
    },
    {
      id: "qr",
      title: "QR kodunu oluştur ve masana yapıştır",
      description:
        "Menün hazır! Son adım: QR kodlarını oluştur, yazdır ve masalara yapıştır. Müşterilerin telefonlarının kamerasıyla okutarak menüne anında erişebilir. Kurulum gerektirmez, uygulama indirmek gerekmez.",
      done: qrPrinted,
      actionLabel: "QR kodlarına git",
      onAction: () => onSwitchTab("qr"),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  if (dismissed) return null;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-50 p-2 rounded-xl shrink-0">
            <Rocket className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {allDone ? "Menün hazır!" : "Menüne hazırlan"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {allDone
                ? "Tüm adımları tamamladın. Müşterilerin artık menüne erişebilir."
                : `${completedCount} / ${steps.length} adım tamamlandı — devam etmek için aşağıdaki adımları izle`}
            </p>
          </div>
        </div>
        <button
          onClick={dismiss}
          title="Kapat"
          className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-orange-400 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-50">
        {steps.map((step) => (
          <div key={step.id} className={`flex gap-3 py-3 first:pt-0 last:pb-0 ${step.done ? "opacity-50" : ""}`}>
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
                      className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
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
