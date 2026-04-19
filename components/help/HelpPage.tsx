"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Coffee, FolderOpen, Plus, Sparkles, Smartphone,
  Palette, QrCode, BarChart2, MessageCircle, Menu, X, Star,
  AlertTriangle, Info, ChevronRight, Rocket,
} from "lucide-react";
import AIChatMockup from "@/components/AIChatMockup";
import AIBulkScanMockup from "@/components/AIBulkScanMockup";
import StatsDemo from "./demos/StatsDemo";
import QRDemo from "./demos/QRDemo";
import CategoryDemo from "./demos/CategoryDemo";
import AppearanceDemo from "./demos/AppearanceDemo";
import ProductDemo from "./demos/ProductDemo";

// ─── Bölüm tanımları ────────────────────────────────────────────────
const SECTIONS = [
  { id: "baslangic",       number: "01", label: "Başlangıç",          icon: <Rocket className="w-4 h-4" />,         color: "#f97316", bg: "#fff7ed" },
  { id: "kafe-bilgileri",  number: "02", label: "Kafe Bilgileri",      icon: <Coffee className="w-4 h-4" />,         color: "#f59e0b", bg: "#fffbeb" },
  { id: "kategoriler",     number: "03", label: "Kategoriler",         icon: <FolderOpen className="w-4 h-4" />,     color: "#f97316", bg: "#fff7ed" },
  { id: "urun-ekleme",     number: "04", label: "Ürün Ekleme",         icon: <Plus className="w-4 h-4" />,           color: "#10b981", bg: "#f0fdf4" },
  { id: "ai-kayit",        number: "05", label: "AI Toplu Kayıt",      icon: <Sparkles className="w-4 h-4" />,       color: "#8b5cf6", bg: "#f5f3ff" },
  { id: "canli-onizleme",  number: "06", label: "Canlı Önizleme",      icon: <Smartphone className="w-4 h-4" />,     color: "#3b82f6", bg: "#eff6ff" },
  { id: "gorunum",         number: "07", label: "Görünüm & Tema",      icon: <Palette className="w-4 h-4" />,        color: "#ec4899", bg: "#fdf2f8" },
  { id: "qr-kodlar",       number: "08", label: "QR Kodlar",           icon: <QrCode className="w-4 h-4" />,         color: "#374151", bg: "#f9fafb" },
  { id: "istatistikler",   number: "09", label: "İstatistikler",       icon: <BarChart2 className="w-4 h-4" />,      color: "#22c55e", bg: "#f0fdf4" },
  { id: "chatbot",         number: "10", label: "AI Chatbot",          icon: <MessageCircle className="w-4 h-4" />,  color: "#6366f1", bg: "#eef2ff" },
] as const;

// ─── Yardımcı bileşenler ─────────────────────────────────────────────
function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-0.5 select-none">
            {i + 1}
          </span>
          <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-2.5 bg-orange-50 border border-orange-100 rounded-xl p-4">
      <Star className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-orange-800 leading-relaxed">{children}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4">
      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-800 leading-relaxed">{children}</p>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800 leading-relaxed">{children}</p>
    </div>
  );
}

function SectionHeader({ s }: { s: typeof SECTIONS[number] }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
        style={{ backgroundColor: s.color }}
      >
        {s.icon}
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: s.color }}>
          {s.number}
        </p>
        <h2 className="text-2xl font-bold text-gray-900">{s.label}</h2>
      </div>
    </div>
  );
}

// Layout: demo + açıklama yan yana
function SectionLayout({
  demo,
  steps,
  description,
  extra,
}: {
  demo: React.ReactNode;
  steps: string[];
  description: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-3">{demo}</div>
      <div className="lg:col-span-2 space-y-2">
        <p className="text-gray-600 leading-relaxed mb-5">{description}</p>
        <StepList steps={steps} />
        {extra}
      </div>
    </div>
  );
}

// ─── Ana bileşen ─────────────────────────────────────────────────────
export default function HelpPage() {
  const [activeId, setActiveId] = useState<string>("baslangic");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Scroll spy
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const filteredSections = SECTIONS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-black text-orange-500 tracking-tight">Qef</span>
            <span className="text-gray-300 text-sm">/</span>
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">
              Yardım Merkezi
            </span>
          </Link>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Admin Paneli</span>
        </Link>
      </header>

      <div className="flex">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside
          className={`
            fixed top-14 left-0 bottom-0 w-64 bg-white border-r border-gray-100 overflow-y-auto z-40
            transform transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          {/* Arama */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Bölüm listesi */}
          <nav className="p-3 space-y-0.5">
            {filteredSections.length === 0 ? (
              <p className="text-sm text-gray-300 text-center py-4">Sonuç bulunamadı</p>
            ) : (
              filteredSections.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                      isActive ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 text-white"
                      style={{ backgroundColor: isActive ? s.color : "#e5e7eb" }}
                    >
                      <div className={isActive ? "text-white" : "text-gray-400"}>
                        {s.icon}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold transition-colors duration-150 ${isActive ? "text-orange-500" : "text-gray-300"}`}>
                        {s.number}
                      </p>
                      <p className={`text-sm font-medium leading-tight transition-colors duration-150 ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                        {s.label}
                      </p>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </nav>

          {/* Alt bilgi */}
          <div className="p-4 mt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Sorun mu var?{" "}
              <a href="mailto:destek@qefmenu.com" className="text-orange-400 hover:underline font-medium">
                destek@qefmenu.com
              </a>
            </p>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── İçerik ────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-64 min-w-0">
          <div className="max-w-4xl mx-auto px-4 lg:px-10 py-10 space-y-6">

            {/* ── 01 BAŞLANGIÇ ─────────────────────────────────────── */}
            <section id="baslangic" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[0]} />

              <p className="text-gray-600 leading-relaxed mb-6">
                Hoş geldiniz! Qef&apos;te dijital menünüzü oluşturmak çok basit. Sadece 3 adım var ve hepsini bir kez yapmanız yeterli — sonrasında menüde değişiklik yapmak istediğinizde sadece ilgili ürünü düzenliyorsunuz.
              </p>

              {/* 3-adım kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "📂", title: "Önce kategorileri kur", desc: "Menünüzü bölümlere ayırın. Örneğin: Kahveler, Tatlılar, Soğuk İçecekler. Bunları istediğiniz zaman değiştirebilirsiniz." },
                  { icon: "🍽️", title: "Ürünleri gir", desc: "Her ürüne isim, fiyat ve isteğe bağlı fotoğraf ekleyin. Çok ürününüz varsa AI ile tek seferde onlarcasını yükleyebilirsiniz." },
                  { icon: "📲", title: "QR kodu paylaş", desc: "Hazır! Kodu yazdırıp masalara yapıştırın. Müşteri telefonu ile tarayınca doğrudan menünüz açılır." },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col gap-3 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5"
                  >
                    <span className="absolute top-3 right-3 text-xs font-black text-orange-200 select-none">0{i + 1}</span>
                    <span className="text-2xl">{step.icon}</span>
                    <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <Tip>
                Çok sayıda ürününüz varsa önce <strong>AI Toplu Kayıt</strong> sekmesine gidin. Ürün fotoğraflarını yükleyin — AI isimleri ve açıklamaları otomatik yazsın. Siz sadece fiyatları girin, dakikalar içinde biter.
              </Tip>
            </section>

            {/* ── 02 KAFE BİLGİLERİ ────────────────────────────────── */}
            <section id="kafe-bilgileri" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[1]} />
              <SectionLayout
                description="Burada kafeye ait temel bilgileri giriyorsunuz. Müşterileriniz menüde kafe adınızı, açıklamanızı ve çalışma saatlerinizi görebilir."
                demo={
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 space-y-3">
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                      <p className="text-[10px] text-gray-400 font-medium mb-1">Kafe Adı</p>
                      <p className="text-sm font-semibold text-gray-800">Antep Kahvesi</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                      <p className="text-[10px] text-gray-400 font-medium mb-1">Otomatik oluşturulan menü linki</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs text-gray-400">qefmenu.com/menu/</span>
                        <span className="text-xs font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded-md">antep-kahvesi</span>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">↑ Kafe adından otomatik oluşturuldu</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-center">
                        <p className="text-[9px] text-gray-400">Pazartesi</p>
                        <p className="text-xs font-semibold text-gray-700">09:00 – 22:00</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-center">
                        <p className="text-[9px] text-gray-400">Pazar</p>
                        <p className="text-xs font-semibold text-gray-700">10:00 – 21:00</p>
                      </div>
                    </div>
                  </div>
                }
                steps={[
                  "Kafe adınızı girin — menü linki (URL) kafe adınızdan otomatik oluşturulur. Örneğin \"Antep Kahvesi\" yazarsanız link \"antep-kahvesi\" olur.",
                  "İsterseniz URL'i kendiniz de düzenleyebilirsiniz. Sadece küçük harf ve tire kullanın (boşluk yok).",
                  "İsteğe bağlı: kısa bir açıklama, çalışma saatleri, adres veya Google Maps linki ekleyin — bunlar müşteriye görünür.",
                  "En üstteki \"Kaydet\" butonuna tıklayın.",
                ]}
                extra={
                  <Warning>
                    Menü URL'inizi bir kez belirledikten sonra <strong>değiştirmeyin.</strong> Eğer URL değişirse, masalara yapıştırdığınız veya bastırdığınız QR kodlar artık çalışmaz — çünkü o QR kodlar eski adrese bağlı. Değişiklik yapmadan önce sistemi sizi uyarır.
                  </Warning>
                }
              />
            </section>

            {/* ── 03 KATEGORİLER ───────────────────────────────────── */}
            <section id="kategoriler" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[2]} />
              <SectionLayout
                description="Kategoriler menünüzün bölümleridir — tıpkı bir kağıt menüdeki başlıklar gibi. Müşteri menüyü açınca önce kategorileri görür, tıklayarak içine girer."
                demo={<CategoryDemo />}
                steps={[
                  "\"Kategoriler\" bölümüne gelin, kutuya kategori adını yazın (örn. \"Soğuk Kahveler\") ve \"Ekle\"ye tıklayın.",
                  "Birden fazla kategoriniz varsa soldaki üç çizgi ikonundan tutup sürükleyerek sırayı değiştirebilirsiniz — müşteri menüde tam bu sırayla görür.",
                  "Silmek istediğinizde kategorinin yanındaki X'e tıklayın.",
                ]}
                extra={
                  <Note>
                    İçinde ürün olan bir kategoriyi silemezsiniz — önce o kategorideki ürünleri başka bir yere taşımanız veya silmeniz gerekir.
                  </Note>
                }
              />
            </section>

            {/* ── 04 ÜRÜN EKLEME ───────────────────────────────────── */}
            <section id="urun-ekleme" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[3]} />
              <SectionLayout
                description="Menünüze tek tek ürün ekleyebileceğiniz formdur. Zorunlu olan sadece ürün adı, fiyat ve kategori — geri kalan her şey isteğe bağlı."
                demo={<ProductDemo />}
                steps={[
                  "\"Yeni ürün ekle\" bölümüne gelin. Ürün adını yazın — sağda telefon önizlemesi anında güncellenir.",
                  "Fiyatı girin ve hangi kategoriye ait olduğunu seçin. Kategori seçmezseniz otomatik olarak \"Genel\"e eklenir.",
                  "İsteğe bağlı: açıklama, kalori bilgisi, etiketler (Vegan, Acılı, Glutensiz gibi) ve içerik emojileri ekleyin — bunlar müşteriye detay sayfasında gösterilir.",
                  "Fotoğraf eklemek istiyorsanız \"Görsel Ekle\"ye tıklayın. Dosya boyutu ne olursa olsun sistem otomatik küçültür.",
                  "\"Ekle\" butonuna basın, ürün menünüze eklenir.",
                ]}
                extra={
                  <Tip>
                    Geniş ekranda (masaüstü) çalışıyorsanız sağ tarafta müşterinin göreceği kartın canlı önizlemesi çıkar. Ürün kaydedilince önizleme o ürüne otomatik kayar.
                  </Tip>
                }
              />
            </section>

            {/* ── 05 AI TOPLU KAYIT ────────────────────────────────── */}
            <section id="ai-kayit" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[4]} />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                  <AIBulkScanMockup />
                </div>
                <div className="lg:col-span-2 space-y-2">
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Çok sayıda ürün ekleyecekseniz bu özellik çok işinize yarar. Ürünlerin fotoğraflarını yüklüyorsunuz, yapay zeka her birini analiz ederek Türkçe ve İngilizce isim ile açıklama yazıyor. Siz sadece fiyat ve kategori giriyorsunuz.
                  </p>
                  <StepList steps={[
                    "\"AI Kayıt\" sekmesine geçin. Fotoğrafları büyük alana sürükleyin ya da tıklayıp seçin — bir seferde en fazla 15 fotoğraf yükleyebilirsiniz.",
                    "\"Analiz Et\" butonuna tıklayın. Yapay zeka her fotoğraftaki ürünü tanıyıp isim ve açıklama yazar, birkaç saniye bekleyin.",
                    "Oluşturulan bilgileri beğenmediyseniz üstüne tıklayıp düzenleyin.",
                    "Her ürüne fiyat ve kategori girin — bunlar zorunlu. İsterseniz kalori, etiket ve içerik de ekleyebilirsiniz.",
                    "\"Ürünleri Kaydet\" butonuna basın, hepsi tek seferde menünüze eklenir.",
                  ]} />
                  <Tip>
                    En iyi sonuç için aydınlık, net fotoğraflar kullanın ve her fotoğrafta tek bir ürün olsun. Karanlık veya bulanık fotoğraflarda yapay zeka yanılabilir.
                  </Tip>
                </div>
              </div>
            </section>

            {/* ── 06 CANLI ÖNİZLEME ────────────────────────────────── */}
            <section id="canli-onizleme" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[5]} />
              <SectionLayout
                description="Ürün eklerken ekranın sağ tarafında küçük bir telefon simülasyonu belirir. Yazdığınız her şey o telefonda anında güncellenir — müşterinizin gördüğünü siz de görürsünüz."
                demo={
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 space-y-3">
                    {/* Mock split-screen */}
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 space-y-2 min-w-0">
                        <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Admin Paneli</p>
                        {["Ürün adı: Türk Kahvesi", "Fiyat: 45 ₺", "Kategori: Kahveler", "Açıklama: ..."].map((line, i) => (
                          <div key={i} className="bg-white rounded-xl border border-gray-200 px-3 py-2">
                            <p className="text-xs text-gray-600">{line}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 pt-10">
                        <div className="w-5 h-0.5 bg-blue-300 rounded" />
                        <div className="w-0 h-0 border-t-3 border-t-transparent border-b-3 border-b-transparent border-l-[5px] border-l-blue-300" />
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-2">Önizleme</p>
                        <div className="w-[72px] h-[100px] bg-gray-900 rounded-[16px] p-[2.5px] shadow-lg">
                          <div className="w-full h-full bg-white rounded-[13px] overflow-hidden flex flex-col">
                            <div className="h-10 bg-gradient-to-b from-gray-200 to-gray-100 flex-shrink-0" />
                            <div className="p-1.5 flex-1 space-y-1">
                              <p className="text-[7px] font-bold text-gray-800">Türk Kahvesi</p>
                              <p className="text-[6px] text-orange-500 font-bold">45.00 ₺</p>
                              <div className="flex gap-0.5">
                                <span className="text-[5.5px] bg-orange-100 text-orange-600 px-1 rounded-full font-medium">Kahveler</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-blue-400 text-center">← Her değişiklik anında yansır →</p>
                  </div>
                }
                steps={[
                  "Ürün ekleme formuna gelin — ekranın sağında telefon önizlemesi otomatik açılır.",
                  "Ürün adını yazmaya başlayın, fiyat girin — her şey sağdaki telefonda anında güncellenir.",
                  "Kategori değiştirirseniz önizleme o ürünü doğru kategoriye taşır ve otomatik kaydırır.",
                  "\"Ekle\"ye bastıktan sonra yeni ürün önizlemede 2 saniye vurgulanır, sonra tekrar sıradaki ürüne hazır hale gelir.",
                ]}
                extra={
                  <Note>
                    Önizleme sadece <strong>geniş ekranda (masaüstü, 1280px+)</strong> görünür. Tablette veya telefonda bu panel gizlenir — ama eklediğiniz ürünler yine de kaydedilir, merak etmeyin.
                  </Note>
                }
              />
            </section>

            {/* ── 07 GÖRÜNÜM ───────────────────────────────────────── */}
            <section id="gorunum" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[6]} />
              <SectionLayout
                description="Menünüzün rengini, ürünlerin nasıl dizileceğini ve fotoğrafların hangi şekilde gösterileceğini buradan ayarlıyorsunuz. Kaydet'e bastığınız an müşteri menüsüne yansır."
                demo={<AppearanceDemo />}
                steps={[
                  "\"Görünüm\" sekmesine gelin. Renk kutusuna tıklayarak ana rengi seçin — bu renk menüdeki tüm başlıklarda, fiyatlarda ve vurgu noktalarında kullanılır.",
                  "Ürün düzeni için iki seçenek var: \"Liste\" ürünleri yatay sıralar (isim solda, fiyat sağda), \"Kart\" ise 2 sütunlu ızgara yapar ve fotoğraflar daha büyük görünür.",
                  "Görsel oranı fotoğraflarınızın nasıl kesildiğini belirler: Kare her ürünü eşit boyutta gösterir, Geniş yatay fotoğraflar için idealdir, Yuvarlak daha şık bir görünüm verir.",
                  "\"Kaydet\"e tıklayın — değişiklikler müşteri menüsüne anında uygulanır.",
                ]}
                extra={
                  <Tip>
                    Hangi kombinasyonun daha iyi görüneceğinden emin değilseniz: yemek ağırlıklı menüler için <strong>Kart + Geniş</strong>, içecek veya kısa listeli menüler için <strong>Liste + Kare</strong> genellikle iyi durur.
                  </Tip>
                }
              />
            </section>

            {/* ── 08 QR KODLAR ─────────────────────────────────────── */}
            <section id="qr-kodlar" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[7]} />
              <SectionLayout
                description="QR kod, müşterilerin telefonunu kameraya tuttuğunda doğrudan menünüzü açan siyah-beyaz bir koddur. Menünüzde değişiklik yaptığınızda QR kodu yeniden indirmenize gerek yok — kod her zaman en güncel menüyü gösterir."
                demo={<QRDemo />}
                steps={[
                  "\"QR Kodlar\" sekmesine gelin.",
                  "\"İndir\" butonuna tıklayın — PNG formatında bilgisayarınıza kaydedilir. Bunu yazıcıya gönderip her masa için çıktı alabilirsiniz.",
                  "İsterseniz menü linkini de kopyalayabilirsiniz. Bu linki WhatsApp mesajında, Instagram bio'sunda veya Google işletme profilinizde paylaşabilirsiniz.",
                ]}
                extra={
                  <Tip>
                    QR kodları beyaz veya açık renk arka zemine, koyu (siyah) mürekkepli yazıcıyla basın. Renkli veya karanlık arka zeminlere basılan QR kodlar bazı telefonlarda okumaz.
                  </Tip>
                }
              />
            </section>

            {/* ── 09 İSTATİSTİKLER ─────────────────────────────────── */}
            <section id="istatistikler" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[8]} />
              <SectionLayout
                description="Menünüzü kaç kişinin açtığını, hangi günler daha kalabalık geçtiğini ve müşterilerin hangi saatte geldiğini buradan görebilirsiniz. Ekstra bir şey yapmanıza gerek yok — sistem otomatik sayar."
                demo={<StatsDemo />}
                steps={[
                  "\"İstatistikler\" sekmesine gelin. Bugün, bu hafta ve bu ay kaç kişinin menünüzü açtığını görürsünüz.",
                  "Grafikteki çubuklara bakarak hangi günler daha yoğun olduğunu anlayabilirsiniz — örneğin Cuma ve Cumartesi çok daha yüksekse hafta sonu kampanya düşünebilirsiniz.",
                  "En yoğun saat bilgisi de gösterilir — müşterilerinizin büyük çoğunluğu öğle mi geliyor, akşam mı? Bu bilgiyle sosyal medya paylaşım zamanlamanızı ayarlayabilirsiniz.",
                ]}
                extra={
                  <Note>
                    Veriler son 30 günü kapsar. Aynı kişi birden fazla kez açarsa her biri ayrı sayılır — bu yüzden rakamlar gerçek ziyaret sayısına yakın ama tam değil.
                  </Note>
                }
              />
            </section>

            {/* ── 10 AI CHATBOT ────────────────────────────────────── */}
            <section id="chatbot" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[9]} />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                  <AIChatMockup />
                </div>
                <div className="lg:col-span-2 space-y-2">
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Menünüzün sağ alt köşesinde bir sohbet balonu belirir. Müşteri buna tıklayıp soru sorabilir — &quot;glutensiz bir şeyiniz var mı?&quot;, &quot;en popüler tatlınız ne?&quot; gibi. Yapay zeka sizin menünüzdeki ürünleri bilerek yanıt verir, genel bilgi vermez.
                  </p>
                  <StepList steps={[
                    "\"Ayarlar\" sekmesine gidin ve \"AI Chatbot\" seçeneğini açın. Kaydetmenize gerek yok, anında aktif olur.",
                    "Bundan sonra menünüzü açan her müşteri sağ altta sohbet balonunu görecek.",
                    "Müşteri sorusunu yazar, bot birkaç saniye içinde menünüzdeki bilgilere dayanarak Türkçe yanıt verir.",
                    "İsterseniz aynı sayfadan chatbot'u kapatabilirsiniz — müşteri tarafında balon kaybolur.",
                  ]} />
                  <Note>
                    Spam ve aşırı kullanımı önlemek için giriş yapmamış ziyaretçiler günde en fazla <strong>7 mesaj</strong> gönderebilir. Siz kafe sahibi olarak giriş yaptığınızda bu limit uygulanmaz, istediğiniz kadar test edebilirsiniz.
                  </Note>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">
                Başka sorularınız mı var?{" "}
                <a href="mailto:destek@qefmenu.com" className="text-orange-400 hover:underline font-medium">
                  destek@qefmenu.com
                </a>
              </p>
              <Link
                href="/admin"
                className="mt-4 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Admin Paneline Dön
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
