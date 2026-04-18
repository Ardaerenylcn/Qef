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

              {/* 3-adım kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "📂", title: "Kategoriler oluştur", desc: "Kahveler, Tatlılar, Ana Yemekler gibi menü bölümlerinizi belirleyin." },
                  { icon: "🍽️", title: "Ürünleri ekle", desc: "Fotoğraf, fiyat ve açıklamayı girin. AI ile tek seferde onlarcasını yükleyin." },
                  { icon: "📲", title: "QR kodu paylaş", desc: "Kodu yazdırıp masalara yapıştırın. Müşteriler tarayarak menüye ulaşsın." },
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
                İlk kurulumda <strong>AI Toplu Kayıt</strong> özelliğini kullanarak ürün fotoğraflarınızı yükleyin — AI isim ve açıklamayı otomatik oluştursun. Dakikalar içinde onlarca ürün ekleyebilirsiniz.
              </Tip>
            </section>

            {/* ── 02 KAFE BİLGİLERİ ────────────────────────────────── */}
            <section id="kafe-bilgileri" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[1]} />
              <SectionLayout
                description="Kafe adınız, menü URL'iniz, çalışma saatleriniz, adres ve Google Maps linkinizi buradan yönetin."
                demo={
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 space-y-3">
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                      <p className="text-[10px] text-gray-400 font-medium mb-1">Kafe Adı</p>
                      <p className="text-sm font-semibold text-gray-800">Antep Kahvesi</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                      <p className="text-[10px] text-gray-400 font-medium mb-1">Menü URL&apos;i</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">qefmenu.com/menu/</span>
                        <span className="text-xs font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded-md">antep-kahvesi</span>
                      </div>
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
                  "Kafe adınızı ve kısa açıklamasını girin.",
                  "Menü URL'inizi belirleyin (küçük harf, tire kullanın).",
                  "İsteğe bağlı: çalışma saatleri, adres ve Google Maps linkini ekleyin.",
                  "\"Kaydet\" butonuna tıklayın.",
                ]}
                extra={
                  <Warning>
                    URL'inizi bir kez belirledikten sonra değiştirmeyin. Değiştirildiğinde daha önce bastırdığınız tüm QR kodlar çalışmayı durdurur.
                  </Warning>
                }
              />
            </section>

            {/* ── 03 KATEGORİLER ───────────────────────────────────── */}
            <section id="kategoriler" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[2]} />
              <SectionLayout
                description="Menünüzü anlamlı bölümlere ayırın. Kategori sırası müşterinin gördüğü sırayla aynıdır."
                demo={<CategoryDemo />}
                steps={[
                  "Kategori adını girin ve \"Ekle\"ye tıklayın.",
                  "Kategorileri sürükleyerek istediğiniz sıraya getirin.",
                  "Boş kategorileri X butonu ile silebilirsiniz.",
                ]}
                extra={
                  <Note>
                    İçinde ürün olan bir kategoriyi silemezsiniz. Önce ürünleri başka bir kategoriye taşıyın veya silin.
                  </Note>
                }
              />
            </section>

            {/* ── 04 ÜRÜN EKLEME ───────────────────────────────────── */}
            <section id="urun-ekleme" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[3]} />
              <SectionLayout
                description="Her ürün için ad, açıklama, fiyat, görsel ve içerik bilgisi girebilirsiniz. İngilizce çeviri de ekleyebilirsiniz."
                demo={<ProductDemo />}
                steps={[
                  "Ürün adı ve açıklamasını yazın.",
                  "Fiyat girin ve kategori seçin.",
                  "İsteğe bağlı: kalori, etiketler (Vegan, Glutensiz...) ve içerik emojileri ekleyin.",
                  "Görsel yükleyin — dosya otomatik sıkıştırılır.",
                  "\"Ekle\" butonuna tıklayın.",
                ]}
                extra={
                  <Tip>
                    Ürün eklenince sağdaki <strong>canlı önizleme</strong> otomatik güncellenir. Yeni eklenen ürüne otomatik scroll eder.
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
                    15&apos;e kadar ürün fotoğrafı yükleyin, Gemini 2.5 Flash modeli her ürün için otomatik olarak Türkçe ve İngilizce isim + açıklama oluştursun.
                  </p>
                  <StepList steps={[
                    "Ürün fotoğraflarını sürükleyip bırakın veya tıklayarak seçin.",
                    "\"Analiz Et\" butonuna tıklayın — AI her ürünü tanır.",
                    "Oluşturulan bilgileri dilediğiniz gibi düzenleyin.",
                    "Her ürüne fiyat, kategori, etiket ve içerik ekleyin.",
                    "\"Ürünleri Kaydet\" ile hepsini bir seferde kaydedin.",
                  ]} />
                  <Tip>
                    En iyi sonuç için aydınlık çekilmiş, net fotoğraflar kullanın. Her fotoğrafta tek bir ürün olsun.
                  </Tip>
                </div>
              </div>
            </section>

            {/* ── 06 CANLI ÖNİZLEME ────────────────────────────────── */}
            <section id="canli-onizleme" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[5]} />
              <SectionLayout
                description="Ürün eklerken veya düzenlerken sağ tarafta müşterinin gördüğü kart görünümü canlı olarak güncellenir."
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
                  "Ürün ekleme veya düzenleme ekranını açın.",
                  "Herhangi bir alanı doldurun — önizleme anında güncellenir.",
                  "Kategori değiştirdiğinizde önizleme otomatik scroll eder.",
                  "Ürün kaydedilince önizlemede vurgulanarak gösterilir.",
                ]}
                extra={
                  <Note>
                    Önizleme yalnızca <strong>1280px ve üzeri</strong> geniş ekranlarda (masaüstü) görünür.
                  </Note>
                }
              />
            </section>

            {/* ── 07 GÖRÜNÜM ───────────────────────────────────────── */}
            <section id="gorunum" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[6]} />
              <SectionLayout
                description="Menünüzün ana rengini, ürün düzenini ve görsel oranını özelleştirin. Tüm değişiklikler müşteri menüsüne anında yansır."
                demo={<AppearanceDemo />}
                steps={[
                  "Ana rengi renk paletinden seçin.",
                  "Ürün düzenini seçin: Liste (yatay) veya Kart (2 sütun ızgara).",
                  "Görsel oranını seçin: Kare, Geniş (16:9) veya Yuvarlak.",
                  "\"Kaydet\" butonuna tıklayın.",
                ]}
                extra={
                  <Tip>
                    Ürün düzeni ve görsel oranı menünüzün genel havasını büyük ölçüde değiştirir. Yemek ağırlıklı menülerde <strong>Kart + Geniş</strong>, içecek menülerinde <strong>Liste</strong> daha iyi görünebilir.
                  </Tip>
                }
              />
            </section>

            {/* ── 08 QR KODLAR ─────────────────────────────────────── */}
            <section id="qr-kodlar" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[7]} />
              <SectionLayout
                description="Müşterileriniz QR kodu telefonlarıyla tarayarak menünüze anında ulaşabilir. QR kod her zaman güncel menüyü gösterir."
                demo={<QRDemo />}
                steps={[
                  "\"QR Kodlar\" sekmesini açın.",
                  "\"İndir\" butonu ile PNG formatında indirip yazdırın.",
                  "Menü linkini kopyalayıp WhatsApp, Instagram veya diğer platformlarda paylaşın.",
                ]}
                extra={
                  <Tip>
                    QR kodları parlak arka plana basmayın. Koyu arka zemine açık renkli veya açık arka zemine koyu renkli baskı çok daha iyi okunur.
                  </Tip>
                }
              />
            </section>

            {/* ── 09 İSTATİSTİKLER ─────────────────────────────────── */}
            <section id="istatistikler" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <SectionHeader s={SECTIONS[8]} />
              <SectionLayout
                description="Menünüzü kaç kişinin ziyaret ettiğini ve ne zaman baktığını gerçek zamanlı olarak takip edin."
                demo={<StatsDemo />}
                steps={[
                  "\"İstatistikler\" sekmesini açın.",
                  "Günlük, haftalık ve aylık görüntüleme sayılarını inceleyin.",
                  "Günlük grafikten hangi günlerin yoğun geçtiğini görün.",
                  "En yoğun saati belirleyerek kampanya ve indirim zamanlaması yapın.",
                ]}
                extra={
                  <Note>
                    İstatistikler son 30 günün verilerini kapsar. Her ziyaretçi sayımı benzersiz IP bazında yapılır.
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
                    Müşterileriniz menü sayfasında ürünler hakkında soru sorabilir. Chatbot, menünüzdeki ürünleri tanıyarak gerçek zamanlı olarak yanıt verir.
                  </p>
                  <StepList steps={[
                    "\"Ayarlar\" sekmesinden AI Chatbot'u etkinleştirin.",
                    "Müşteriler menü sayfasındaki chat balonuna tıklar.",
                    "\"Glutensiz seçenekler var mı?\" gibi sorular sorabilirler.",
                    "Bot menünüzdeki bilgilere göre Türkçe yanıt verir.",
                  ]} />
                  <Note>
                    Giriş yapmamış ziyaretçiler günde <strong>7 mesaj</strong> gönderebilir. Kafe sahibi olarak giriş yaptığınızda bu limit uygulanmaz.
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
