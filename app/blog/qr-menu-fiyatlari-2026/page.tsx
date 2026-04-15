import type { Metadata } from "next";
import Link from "next/link";
import { QrCode, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "QR Menü Fiyatları 2026: Ücretli mi, Ücretsiz mi? | Qef Blog",
  description: "Türkiye'deki QR menü platformlarının 2026 fiyatlarını karşılaştırın. Ücretsiz ve ücretli seçenekler arasındaki farkları öğrenin.",
  alternates: { canonical: "https://qefmenu.com/blog/qr-menu-fiyatlari-2026" },
  openGraph: {
    title: "QR Menü Fiyatları 2026: Ücretli mi, Ücretsiz mi?",
    description: "Türkiye'deki QR menü platformlarının 2026 fiyatlarını karşılaştırın.",
    url: "https://qefmenu.com/blog/qr-menu-fiyatlari-2026",
    type: "article",
    publishedTime: "2026-04-16T00:00:00Z",
    modifiedTime: "2026-04-16T00:00:00Z",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "QR Menü Fiyatları 2026: Ücretli mi, Ücretsiz mi?",
  description: "Türkiye'deki QR menü platformlarının 2026 fiyatlarını karşılaştırın. Ücretsiz ve ücretli seçenekler arasındaki farkları öğrenin.",
  url: "https://qefmenu.com/blog/qr-menu-fiyatlari-2026",
  datePublished: "2026-04-16T00:00:00Z",
  dateModified: "2026-04-16T00:00:00Z",
  author: { "@type": "Organization", name: "Qef", url: "https://qefmenu.com" },
  publisher: { "@type": "Organization", name: "Qef", logo: { "@type": "ImageObject", url: "https://qefmenu.com/favicon.svg" } },
  inLanguage: "tr",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://qefmenu.com/blog/qr-menu-fiyatlari-2026" },
};

export default function Post4() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/<\/script>/gi, "<\\/script>") }} />

      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-gray-900 text-xl tracking-tight">Qef</span>
        </Link>
        <Link href="/blog" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
          ← Blog
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <time dateTime="2026-04-16">16 Nisan 2026</time>
            <span>·</span>
            <span>5 dk okuma</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            QR Menü Fiyatları 2026: Ücretli mi, Ücretsiz mi?
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Kafeniniz için QR menü araştırıyorsunuz ama fiyatlar kafanızı karıştırdı mı? Aylık abonelik mi, yıllık mı, ücretsiz mi? İşte 2026'da bilmeniz gereken her şey.
          </p>
        </div>

        <hr className="border-gray-100" />

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>
            Dijital menüye geçmeye karar verdiniz — harika. Ama araştırmaya başladığınızda onlarca platform, onlarca farklı fiyat modeliyle karşılaşıyorsunuz. Aylık 200₺'den başlayan seçenekler var, yıllık binlerce lira isteyenler var, "ücretsiz" deyip sonradan ücret çıkaranlar var.
          </p>
          <p>
            Bu yazıda Türkiye'deki QR menü fiyatlandırma modellerini açıklıyor, nelere dikkat etmeniz gerektiğini anlatıyoruz.
          </p>

          <h2 className="text-xl font-bold text-gray-900">QR Menü Platformları Nasıl Ücretlendirir?</h2>
          <p>Piyasada temel olarak üç fiyatlandırma modeli var:</p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">1. Aylık Abonelik</h3>
              <p className="text-sm text-gray-600">
                Çoğu platform aylık 150₺–500₺ arası ücret alır. Yıl boyunca kullanırsanız 1.800₺–6.000₺'ye kadar çıkabilir.
                Avantajı esneklik — istediğinizde iptal edebilirsiniz. Dezavantajı ise her ay ödeme derdi ve enflasyonla artan maliyetler.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">2. Yıllık Abonelik</h3>
              <p className="text-sm text-gray-600">
                Tek seferlik yıllık ödeme, genellikle aylık seçeneğe göre %20–40 daha ucuzdur.
                Qef bu modeli benimsiyor: yılda 4.999₺ sabit fiyat, aylığa vurulunca ~416₺.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">3. Tamamen Ücretsiz</h3>
              <p className="text-sm text-gray-600">
                Bazı platformlar sınırlı özelliklerle ücretsiz plan sunar: 10–20 ürün limiti, marka logosu kaldırılamaz,
                özelleştirme yok. Gerçek anlamda "ücretsiz ve tam özellikli" bulmak zordur.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900">Fiyat Karşılaştırırken Nelere Dikkat Etmeli?</h2>

          <h3 className="text-lg font-semibold text-gray-800">Ürün limiti var mı?</h3>
          <p>
            Bazı "ücretsiz" planlar 15–20 ürünle sınırlıdır. Bir kafenin ortalama 40–80 ürünü olduğunu düşünürsek bu ciddi bir kısıt.
            Ürün sayısı arttıkça ücretli plana geçmek zorunda kalırsınız — başlangıçta ucuz gibi görünen plan pahalıya patlar.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">Platform logosu kaldırılabiliyor mu?</h3>
          <p>
            Ücretsiz planlarda menünün altında "Bu menü X platform ile oluşturuldu" yazısı kaldırılamaz.
            Profesyonel bir görünüm istiyorsanız bu önemli bir detay.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">Görsel yükleme sınırı var mı?</h3>
          <p>
            Bazı platformlar ürün başına görsel yüklemeyi ücretli plana saklıyor. Görselli menüler görselsizlere kıyasla
            çok daha fazla ilgi gördüğü için bu özellik olmazsa olmaz.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">Dil desteği?</h3>
          <p>
            Turistik bölgelerde çalışıyorsanız ya da yabancı müşteri kitleniz varsa Türkçe + İngilizce destek şart.
            Bu özellik çoğu platformda ücretli plana dahil.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Ücretsiz Deneme Ne İşe Yarar?</h2>
          <p>
            Güvenilir platformlar ücretli özelliklerini denemeniz için ücretsiz deneme süresi sunar.
            Bu sürede gerçek müşterilerinizle platformu test edebilir, arayüzü öğrenebilir ve
            karar vermeden önce değerini görebilirsiniz.
          </p>
          <p>
            <strong>Dikkat:</strong> "Ücretsiz deneme" ile "ücretsiz plan" farklı şeylerdir.
            Deneme süresi ücretli planın tüm özelliklerini geçici olarak açar; süre dolunca ücret başlar veya
            kısıtlı ücretsiz plana düşer.
          </p>

          {/* Karşılaştırma tablosu */}
          <h2 className="text-xl font-bold text-gray-900">Özet: Ne Alıyorsunuz?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-100">Özellik</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700 border border-gray-100">Ücretsiz Plan</th>
                  <th className="text-center px-4 py-3 font-semibold text-orange-600 border border-gray-100 bg-orange-50">Qef Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ürün limiti", "10–20 ürün", "Sınırsız"],
                  ["Görsel yükleme", "Sınırlı", "Sınırsız"],
                  ["Türkçe + İngilizce", "Hayır", "Evet"],
                  ["Özel tema & renkler", "Hayır", "Evet"],
                  ["QR kod indirme", "Kısıtlı", "Sınırsız"],
                  ["AI menü asistanı", "Hayır", "Evet"],
                  ["Platform logosu", "Kaldırılamaz", "Yok"],
                  ["Ziyaret istatistikleri", "Hayır", "Evet"],
                  ["Yıllık maliyet", "Ücretsiz*", "4.999₺"],
                ].map(([feature, free, pro]) => (
                  <tr key={feature} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-700 border border-gray-100">{feature}</td>
                    <td className="px-4 py-3 text-center text-gray-500 border border-gray-100">
                      {free === "Hayır" ? <X className="w-4 h-4 text-red-400 mx-auto" /> : free}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-orange-600 border border-gray-100 bg-orange-50/30">
                      {pro === "Evet" || pro === "Sınırsız" || pro === "Yok"
                        ? <span className="flex items-center justify-center gap-1"><Check className="w-4 h-4 text-green-500" />{pro}</span>
                        : pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">* Ücretsiz planlar genellikle ürün sayısı, görsel ve özellik kısıtlamaları içerir.</p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">Sonuç: Hangi Modeli Seçmeli?</h2>
          <p>
            Kafeyi yeni açıyorsanız ve henüz ne istediğinizi bilmiyorsanız — ücretsiz deneme ile başlayın, platforma alışın.
          </p>
          <p>
            Kafeyi ciddiye alıyorsanız ve profesyonel görünmek istiyorsanız — yıllık sabit fiyatlı bir plan çok daha mantıklı.
            Aylık abonelikler zamanla birikir; yıllık plan hem ucuz hem de "bu ay ödedim mi?" derdini ortadan kaldırır.
          </p>
          <p>
            <strong>Qef'te</strong> 30 gün boyunca tüm özellikleri ücretsiz deneyebilirsiniz. Kredi kartı istenmez,
            deneme sonunda 4.999₺/yıl — aylığa vurulunca 416₺.
          </p>

        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center space-y-4">
          <p className="font-bold text-gray-900">30 gün ücretsiz deneyin</p>
          <p className="text-sm text-gray-500">Kredi kartı gerekmez. Tüm özellikler açık.</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            Ücretsiz Başla →
          </Link>
        </div>
      </article>

      <footer className="text-center text-xs text-gray-300 pb-10 pt-6 border-t border-gray-100">
        <p>© 2026 Qef ·{" "}
          <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
          {" "}·{" "}
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik</Link>
        </p>
      </footer>
    </main>
  );
}
