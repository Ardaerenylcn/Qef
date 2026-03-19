import Link from "next/link";
import Image from "next/image";
import { QrCode, Smartphone, Zap, Star, Check, ChevronRight, Palette, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

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
      <section className="relative max-w-6xl mx-auto px-6 pt-6 pb-20 flex flex-col-reverse md:flex-row items-center gap-12">

        {/* Arka plan dekorasyon */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-40 -left-10 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

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
              src="/mascot.png"
              alt="Qef Maskotu"
              width={380}
              height={380}
              className="relative drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
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
                title: "Ürün etiketleri",
                desc: "Yeni, Popüler, Vejetaryen gibi renkli etiketlerle ürünleri öne çıkarın.",
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
      <footer className="text-center text-xs text-gray-300 pb-10 space-y-1">
        <p className="font-medium">© 2025 Qef — Tüm hakları saklıdır</p>
      </footer>

    </main>
  );
}
