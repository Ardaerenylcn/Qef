import type { Metadata } from "next";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "QR Menü Nedir? Kafeniz İçin Neden Şart? | Qef Blog",
  description: "QR menü teknolojisi nedir, nasıl çalışır ve kafenize ne gibi avantajlar sağlar? Tüm sorularınızın yanıtı bu yazıda.",
  alternates: { canonical: "https://qefmenu.com/blog/qr-menu-nedir" },
  openGraph: {
    title: "QR Menü Nedir? Kafeniz İçin Neden Şart?",
    description: "QR menü teknolojisi nedir, nasıl çalışır ve kafenize ne gibi avantajlar sağlar?",
    url: "https://qefmenu.com/blog/qr-menu-nedir",
    type: "article",
    publishedTime: "2025-03-10T00:00:00Z",
    modifiedTime: "2026-04-15T00:00:00Z",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "QR Menü Nedir? Kafeniz İçin Neden Şart?",
  description: "QR menü teknolojisi nedir, nasıl çalışır ve kafenize ne gibi avantajlar sağlar?",
  url: "https://qefmenu.com/blog/qr-menu-nedir",
  datePublished: "2025-03-10T00:00:00Z",
  dateModified: "2026-04-15T00:00:00Z",
  author: { "@type": "Organization", name: "Qef", url: "https://qefmenu.com" },
  publisher: { "@type": "Organization", name: "Qef", logo: { "@type": "ImageObject", url: "https://qefmenu.com/favicon.svg" } },
  inLanguage: "tr",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://qefmenu.com/blog/qr-menu-nedir" },
};

export default function Post1() {
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
            <time dateTime="2025-03-10">10 Mart 2025</time>
            <span>·</span>
            <span>4 dk okuma</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            QR Menü Nedir? Kafeniz İçin Neden Şart?
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Artık müşteriler kağıt menü beklemek istemiyor. QR menü nedir, nasıl çalışır ve neden her kafe için vazgeçilmez hale geldi?
          </p>
        </div>

        <hr className="border-gray-100" />

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

          <h2 className="text-xl font-bold text-gray-900">QR Menü Nedir?</h2>
          <p>
            QR menü, karenin içine gizlenmiş bir bağlantıyı temsil eden özel bir barkod sistemidir. Müşteriler akıllı telefonlarının kamerasıyla bu kodu okuttuğunda, doğrudan kafenizin dijital menüsüne ulaşır. Uygulama indirmeye, arama yapmaya ya da bağlantı açmaya gerek kalmaz — kamera yeterlidir.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Nasıl Çalışır?</h2>
          <p>
            Çalışma prensibi son derece basittir:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Kafe sahibi dijital menüsünü oluşturur ve bir URL'e yayınlar.</li>
            <li>Bu URL, bir QR koda dönüştürülür.</li>
            <li>QR kod masalara, vitrinlere veya kartvizitlere yerleştirilir.</li>
            <li>Müşteri kamerasını koda tutar — menü açılır.</li>
          </ol>

          <h2 className="text-xl font-bold text-gray-900">Neden Her Kafe İçin Şart?</h2>

          <h3 className="text-lg font-semibold text-gray-800">1. Hijyen ve Güven</h3>
          <p>
            Kağıt menüler onlarca elden geçer. Müşteriler artık bu konuda bilinçli ve hassas. QR menü ile her müşteri kendi telefonunu kullanır — hijyen sorunu ortadan kalkar.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">2. Anlık Güncelleme</h3>
          <p>
            Fiyat mı değişti? Ürün tükendi mi? Kağıt menüde bu değişiklikler haftalar sürer ve baskı masrafı gerektirir. Dijital menüde birkaç saniyede güncellersiniz — menü anında yenilenir.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">3. Maliyet Avantajı</h3>
          <p>
            Kağıt menü basımı, laminasyon ve her sezon yenileme ciddi bir maliyet oluşturur. QR menü bir kez kurulur, yıllarca ücretsiz çalışır.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">4. Çok Dilli Destek</h3>
          <p>
            Yabancı müşterileriniz var mı? Dijital menüde dil değiştirme tek tıkla olur. Türkçe ve İngilizce seçenekler sunarak tüm misafirlerinize eşit hizmet verebilirsiniz.
          </p>

          <h3 className="text-lg font-semibold text-gray-800">5. Profesyonel İmaj</h3>
          <p>
            QR menü kullanan kafeler, müşterilerin gözünde daha modern ve profesyonel görünür. Bu, özellikle ilk izlenim açısından büyük fark yaratır.
          </p>

          <h2 className="text-xl font-bold text-gray-900">QR Menüye Geçmek Zor mu?</h2>
          <p>
            Hayır. <strong>Qef</strong> ile 5 dakikada ücretsiz dijital menünüzü oluşturabilirsiniz. Teknik bilgiye gerek yok, yazılım indirmenize gerek yok. Sadece kayıt olun, ürünlerinizi ekleyin ve QR kodunuzu yazdırın.
          </p>

        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center space-y-4">
          <p className="font-bold text-gray-900">Hemen başlayın — ücretsiz</p>
          <p className="text-sm text-gray-500">5 dakikada dijital menünüzü oluşturun.</p>
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
