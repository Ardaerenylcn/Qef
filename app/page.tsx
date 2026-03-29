import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { QrCode, Smartphone, Zap, Star, Check, ChevronRight, Palette, Globe } from "lucide-react";
import DemoCustomizer from "@/components/DemoCustomizer";
import DemoPhoneMockup from "@/components/DemoPhoneMockup";

export const metadata: Metadata = {
  title: "Qef — Kafen için ücretsiz dijital QR menü",
  description: "Saniyeler içinde kafen için dijital QR menü oluştur. Müşterilerine linki ver veya QR kodu tarat, anında menü görünsün. Ücretsiz, kurulum gerektirmez.",
  alternates: { canonical: "https://qefmenu.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Qef",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://qefmenu.com",
  description: "Kafe ve restoranlar için ücretsiz dijital QR menü oluşturma platformu.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  inLanguage: "tr",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, "<\\/script>") }}
      />

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-gray-900 text-xl tracking-tight">Qef</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
        >
          Giriş Yap →
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-6 pb-20 flex flex-col-reverse md:flex-row items-center gap-12 overflow-hidden">

        {/* Arka plan dekorasyon */}
        <div className="absolute -top-10 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-40 left-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        {/* Sol: metin */}
        <div className="flex-1 space-y-7 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-500 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            %100 Ücretsiz
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Kafeniz için<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
              dijital menü
            </span><br />
            <span className="text-gray-700">hazır.</span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
            QR kodu masaya koyun, müşteriler telefonlarından menüye baksın.
            Uygulama yok, kurulum yok — sadece tara ve gör.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition-all text-sm shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5"
            >
              Ücretsiz Başla
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-semibold px-8 py-4 rounded-2xl transition-all text-sm border border-gray-200 hover:border-gray-300 shadow-sm"
            >
              Zaten hesabım var
            </Link>
          </div>

          {/* Güven rozetleri */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            {["Sınırsız ürün", "İki dil desteği", "Özel QR kodu"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Check className="w-3.5 h-3.5 text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: maskot */}
        <div className="flex-shrink-0 flex justify-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-yellow-100 rounded-full scale-[0.85] blur-3xl opacity-80" />
            <div className="absolute inset-0 bg-orange-50 rounded-full scale-75" />
            <Image
              src="/mascot.webp"
              alt="Qef Maskotu"
              width={380}
              height={380}
              className="relative hover:scale-105 transition-transform duration-500"
              priority
              style={{ width: 380, height: 380, mixBlendMode: "multiply" }}
            />
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="py-20 px-6 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

          {/* Sol: metin */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Canlı Demo</p>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Müşteriniz tam olarak<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                bunu görecek
              </span>
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-sm mx-auto md:mx-0">
              Gerçek bir kafe menüsü. Ürün ara, kategorilere bak, fiyatları gör. Hepsi saniyeler içinde senin için hazır.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-6 py-3 rounded-2xl transition-all text-sm shadow-lg shadow-orange-200"
              >
                Kendi menünü oluştur →
              </Link>
              <Link
                href="/menu/demo"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-semibold px-6 py-3 rounded-2xl transition-all text-sm border border-gray-200 shadow-sm"
              >
                Tam ekranda aç
              </Link>
            </div>
          </div>

          <DemoPhoneMockup />

        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Özellikler</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Neden Qef?</h2>
            <p className="text-gray-400 max-w-md mx-auto">Kafe sahipleri için tasarlandı. Müşteriler için basitleştirildi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: "bg-yellow-50 text-yellow-500",
                title: "Anında kurulum",
                desc: "Kaydol, ürünlerini ekle, QR kodunu yazdır. 5 dakikadan az sürer.",
              },
              {
                icon: Smartphone,
                color: "bg-blue-50 text-blue-500",
                title: "Her telefonda çalışır",
                desc: "Uygulama indirmeye gerek yok. Müşteriler kamerasıyla tarar, anında görür.",
              },
              {
                icon: Palette,
                color: "bg-purple-50 text-purple-500",
                title: "Tamamen özelleştirilebilir",
                desc: "Logo, kapak görseli, renkler, yazı tipi — kafenizin kimliğini yansıtın.",
              },
              {
                icon: Globe,
                color: "bg-green-50 text-green-500",
                title: "İki dil desteği",
                desc: "Türkçe ve İngilizce arasında tek tıkla geçiş. Yabancı misafirler için ideal.",
              },
              {
                icon: Star,
                color: "bg-orange-50 text-orange-500",
                title: "Etiket & İçerik İkonları",
                desc: "✨ Yeni, 🔥 Popüler gibi emoji etiketler ve 57+ içerik ikonu ile ürünlerinizi detaylandırın.",
              },
              {
                icon: QrCode,
                color: "bg-rose-50 text-rose-500",
                title: "QR kodu hazır",
                desc: "Masa numaralı QR kodları oluşturun, tek tıkla indirin ve yazdırın.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-2xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GÜÇLÜ ARAÇLAR */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <p className="text-orange-400 font-bold text-sm uppercase tracking-widest">Güçlü Araçlar</p>
            <h2 className="text-3xl font-extrabold text-white">Menünüzün kontrolü sizde</h2>
            <p className="text-gray-400 max-w-md mx-auto">Sadece menü değil — analizler, toplu düzenleme ve tam özelleştirme.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Menü Analizi */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-5 border border-gray-800 hover:border-orange-500/30 transition-colors">
              <div className="inline-flex p-3 rounded-2xl bg-orange-500/10">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Menü Analizi</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Hangi ürün en çok ilgi görüyor? Kaç kişi menünüzü ziyaret etti? Günlük ve haftalık istatistiklerle kararlarınızı veriye dayandırın.</p>
              </div>
              {/* Mini grafik mockup */}
              <div className="space-y-2">
                {[
                  { name: "Türk Kahvesi", pct: 85, color: "bg-orange-500" },
                  { name: "Latte",        pct: 62, color: "bg-orange-400" },
                  { name: "Cheesecake",   pct: 48, color: "bg-orange-300" },
                  { name: "Waffle",       pct: 31, color: "bg-orange-200" },
                ].map(({ name, pct, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 w-24 truncate">{name}</span>
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toplu Fiyat Güncelleme */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-5 border border-gray-800 hover:border-orange-500/30 transition-colors">
              <div className="inline-flex p-3 rounded-2xl bg-green-500/10">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Kolay Fiyat Güncelleme</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Tüm kategoriye tek seferde zam veya indirim yapın. Tek tek düzenlemek zorunda kalmadan fiyatları anında güncelleyin.</p>
              </div>
              {/* Mini fiyat mockup */}
              <div className="bg-gray-800 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-gray-500 font-medium">Kahveler kategorisi</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-lg px-3 py-1.5 text-xs text-white">+%10</div>
                  <div className="bg-orange-500 rounded-lg px-3 py-1.5 text-xs text-white font-bold">Uygula</div>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Türk Kahvesi</span>
                  <span className="text-gray-400 line-through">35₺</span>
                  <span className="text-green-400 font-bold">38.50₺</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Latte</span>
                  <span className="text-gray-400 line-through">55₺</span>
                  <span className="text-green-400 font-bold">60.50₺</span>
                </div>
              </div>
            </div>

            {/* Banner & Logo */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-5 border border-gray-800 hover:border-orange-500/30 transition-colors">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/10">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Banner & Logo</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Kafenizin kapak fotoğrafını ve logosunu yükleyin. Müşteriler menüyü açtığında sizi hemen tanısın.</p>
              </div>
              {/* Mini banner mockup */}
              <div className="rounded-xl overflow-hidden border border-gray-700">
                <div className="relative h-16 bg-gradient-to-r from-orange-900/50 to-orange-800/30 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/demo/cafe-cover.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
                  <span className="relative text-xs font-bold text-white drop-shadow">Arôme Café</span>
                </div>
                <div className="bg-gray-800 px-3 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <div className="w-4 h-4 rounded bg-orange-400/50" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-16 bg-gray-600 rounded" />
                    <div className="h-1 w-10 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AR SECTION */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-[#0f1c3a] to-slate-900 overflow-hidden relative">

        {/* Arka plan dekorasyon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* İki kolon: sol görsel, sağ içerik */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Sol — Görsel */}
            <div className="w-full lg:w-1/2 flex-shrink-0">
              <Image
                src="/AR.png"
                alt="Artırılmış gerçeklik ile ürünü masada gör"
                width={800}
                height={600}
                className="w-full rounded-3xl object-cover"
              />
            </div>

            {/* Sağ — İçerik */}
            <div className="flex-1 space-y-8">

              {/* Badge + Başlık */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  Türkiye&apos;de Bir İlk
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Müşterileriniz ürünleri<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                    masada görecek
                  </span>
                </h2>
                <p className="text-blue-100/70 leading-relaxed">
                  Artırılmış gerçeklik ile müşterileriniz menüdeki ürünü sipariş vermeden önce
                  kendi masalarında 3 boyutlu olarak görebilir.
                  Uygulama indirmeye gerek yok — sadece kamerayı tut.
                </p>
              </div>

              {/* 3 adım */}
              <div className="space-y-3">
                {[
                  { step: "01", icon: "👆", title: "Ürüne dokun", desc: "Müşteri menüde ilgisini çeken ürüne tıklar." },
                  { step: "02", icon: "📷", title: "Kamerayı aç", desc: "\"Masada Gör\" butonuna basar, kamera açılır." },
                  { step: "03", icon: "✨", title: "Masada görür", desc: "Ürün masanın üzerinde gerçekmiş gibi belirir." },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <span className="text-2xl shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{title}</p>
                      <p className="text-blue-100/50 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-white/15 tracking-widest shrink-0 self-center">{step}</span>
                  </div>
                ))}
              </div>

              {/* Özellikler */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: "📱", text: "Uygulama indirmeye gerek yok" },
                  { icon: "🌍", text: "iOS Safari ve Android Chrome" },
                  { icon: "🤖", text: "Yapay zeka ile 3D model üretilir" },
                  { icon: "⚡", text: "Saniyeler içinde devreye girer" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <span className="text-lg shrink-0">{icon}</span>
                    <p className="text-blue-100/80 text-sm">{text}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-all text-sm shadow-lg shadow-orange-500/30">
                Hemen Başla →
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLEŞTİRME */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Özelleştirme</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Kafenizin kimliğini yansıtın</h2>
            <p className="text-gray-400 max-w-md mx-auto">Renkler, yazı tipleri, ürün düzeni — hepsini tek panelden ayarlayın.</p>
          </div>
          <DemoCustomizer />
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Nasıl çalışır?</p>
          <h2 className="text-3xl font-extrabold text-gray-900">3 adımda dijital menü</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Bağlantı çizgisi */}
          <div className="hidden md:block absolute top-6 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-orange-200 to-orange-200" />

          {[
            { step: "1", title: "Hesap oluştur", desc: "E-posta adresinle saniyeler içinde ücretsiz kayıt ol.", color: "from-orange-500 to-orange-400" },
            { step: "2", title: "Menünü hazırla", desc: "Ürünlerini, kategorilerini, fiyatlarını ve görsellerini ekle.", color: "from-orange-400 to-yellow-400" },
            { step: "3", title: "QR'ı masaya koy", desc: "Kodu yazdır, masaya koy. Müşterilerin taramasını bekle!", color: "from-yellow-400 to-yellow-500" },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="flex flex-col items-center text-center gap-4 relative">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-orange-200 z-10`}>
                {step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-6 mb-20 max-w-6xl md:mx-auto">
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-400 rounded-3xl px-8 py-12 overflow-hidden shadow-2xl shadow-orange-200">
          {/* Dekorasyon */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left space-y-2">
              <p className="text-3xl font-extrabold">Bugün başlayın.</p>
              <p className="text-orange-100">Ücretsiz, sınırsız, hızlı.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/register"
                className="bg-white text-orange-500 hover:bg-orange-50 font-extrabold px-10 py-4 rounded-2xl transition-all text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Ücretsiz Başla →
              </Link>
              <p className="text-orange-200 text-xs">Kurulum gerektirmez · Anında yayında</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-300 pb-10 pt-4 space-y-2 border-t border-gray-100">
        <p className="font-medium">© 2025 Qef — Tüm hakları saklıdır</p>
        <p className="space-x-3">
          <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik Politikası</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-orange-400 transition-colors">Kullanım Koşulları</Link>
          <span>·</span>
          <a href="mailto:destek@qefmenu.com" className="hover:text-orange-400 transition-colors">İletişim</a>
        </p>
      </footer>

    </main>
  );
}
