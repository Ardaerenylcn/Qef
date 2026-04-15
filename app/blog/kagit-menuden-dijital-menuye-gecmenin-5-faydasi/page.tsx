import type { Metadata } from "next";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Kağıt Menüden Dijital Menüye Geçmenin 5 Faydası | Qef Blog",
  description: "Kağıt menüler neden modası geçiyor? Dijital QR menüye geçen kafeler ne kazanıyor? İşte 5 somut fayda.",
  alternates: { canonical: "https://qefmenu.com/blog/kagit-menuden-dijital-menuye-gecmenin-5-faydasi" },
  openGraph: {
    title: "Kağıt Menüden Dijital Menüye Geçmenin 5 Faydası",
    description: "Dijital QR menüye geçen kafeler ne kazanıyor? İşte 5 somut fayda.",
    url: "https://qefmenu.com/blog/kagit-menuden-dijital-menuye-gecmenin-5-faydasi",
    type: "article",
    publishedTime: "2025-03-20T00:00:00Z",
    modifiedTime: "2026-04-15T00:00:00Z",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kağıt Menüden Dijital Menüye Geçmenin 5 Faydası",
  description: "Kağıt menüler neden modası geçiyor? Dijital QR menüye geçen kafeler ne kazanıyor? İşte 5 somut fayda.",
  url: "https://qefmenu.com/blog/kagit-menuden-dijital-menuye-gecmenin-5-faydasi",
  datePublished: "2025-03-20T00:00:00Z",
  dateModified: "2026-04-15T00:00:00Z",
  author: { "@type": "Organization", name: "Qef", url: "https://qefmenu.com" },
  publisher: { "@type": "Organization", name: "Qef", logo: { "@type": "ImageObject", url: "https://qefmenu.com/favicon.svg" } },
  inLanguage: "tr",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://qefmenu.com/blog/kagit-menuden-dijital-menuye-gecmenin-5-faydasi" },
};

export default function Post3() {
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
            <time dateTime="2025-03-20">20 Mart 2025</time>
            <span>·</span>
            <span>3 dk okuma</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Kağıt Menüden Dijital Menüye Geçmenin 5 Faydası
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Yüzlerce kafe dijitale geçiyor. Sebebi ne? İşte kağıt menüyü bırakmanın 5 somut nedeni.
          </p>
        </div>

        <hr className="border-gray-100" />

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>
            Kağıt menü onlarca yıldır kafecilerin vazgeçilmezi oldu. Ama artık durum değişiyor. Müşteri beklentileri farklılaşıyor, maliyetler artıyor ve dijital çözümler her geçen gün daha erişilebilir hale geliyor. İşte kağıt menüden dijital menüye geçmenin 5 somut faydası:
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <span className="text-orange-500 font-extrabold text-lg">1</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Baskı Masrafından Kurtulursunuz</h2>
            </div>
            <p className="pl-13">
              Kağıt menü baskısı, laminasyon, ciltleme ve her sezon yenileme ciddi bir bütçe ister. Üstelik bir ürün fiyatı değiştiğinde tüm menüleri yenilemek zorunda kalırsınız. Dijital menüde bu maliyetlerin tamamı sıfıra iner. Tek seferlik kurulum, sonsuza dek ücretsiz kullanım.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <span className="text-orange-500 font-extrabold text-lg">2</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Fiyatları Anında Güncellersiniz</h2>
            </div>
            <p>
              Enflasyon, mevsimsel değişiklikler veya tedarik sorunları nedeniyle fiyatlarınız değiştiğinde dijital menüyü güncellemek birkaç saniye alır. Değişiklik anında yayına girer — müşterileriniz her zaman güncel fiyatları görür.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <span className="text-orange-500 font-extrabold text-lg">3</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Yabancı Misafirlerinizi Memnun Edersiniz</h2>
            </div>
            <p>
              Turistik bölgelerde ya da kozmopolit şehirlerde faaliyet gösteren kafeler için dil engeli büyük bir sorundur. Dijital menüde dil seçeneği sunmak çok kolaydır. Türkçe ve İngilizce arasında geçiş tek tıkla olur — yabancı misafirleriniz rahatça sipariş verebilir.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <span className="text-orange-500 font-extrabold text-lg">4</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Daha Temiz ve Hijyenik Bir Deneyim Sunarsunuz</h2>
            </div>
            <p>
              Kağıt menüler onlarca elden geçer, temizlenmesi zordur. Müşteriler artık hijyen konusunda çok daha bilinçli. Her müşterinin kendi telefonunu kullandığı QR menü, hijyen kaygısını tamamen ortadan kaldırır ve kafenize olan güveni artırır.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <span className="text-orange-500 font-extrabold text-lg">5</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Rakiplerinizin Önüne Geçersiniz</h2>
            </div>
            <p>
              Dijital menü kullanan kafeler, henüz kağıt menüyle devam edenlere kıyasla daha modern ve profesyonel algılanır. Bu fark özellikle ilk ziyarette belirleyici olur. Müşteriler, teknolojiyi benimseyen işletmelere daha fazla güvenir ve geri dönme olasılıkları artar.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">Geçiş Ne Kadar Sürer?</h2>
          <p>
            Qef ile dijital menüye geçiş ortalama 5 dakika sürer. Hesap açın, ürünlerinizi ekleyin, QR kodunuzu yazdırın. Bu kadar. Teknik bilgiye ihtiyacınız yok, yazılım indirmenize gerek yok — ve tamamen ücretsiz.
          </p>

        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center space-y-4">
          <p className="font-bold text-gray-900">Bugün geçin, farkı hemen görün</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            Ücretsiz Menü Oluştur →
          </Link>
        </div>
      </article>

      <footer className="text-center text-xs text-gray-300 pb-10 pt-6 border-t border-gray-100">
        <p>© 2025 Qef ·{" "}
          <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
          {" "}·{" "}
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik</Link>
        </p>
      </footer>
    </main>
  );
}
