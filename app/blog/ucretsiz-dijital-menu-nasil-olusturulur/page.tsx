import type { Metadata } from "next";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Ücretsiz Dijital Menü Nasıl Oluşturulur? | Qef Blog",
  description: "Hiç teknik bilgi gerektirmeden 5 dakikada ücretsiz dijital QR menü oluşturmanın adım adım rehberi.",
  alternates: { canonical: "https://qefmenu.com/blog/ucretsiz-dijital-menu-nasil-olusturulur" },
  openGraph: {
    title: "Ücretsiz Dijital Menü Nasıl Oluşturulur?",
    description: "5 dakikada ücretsiz dijital QR menü oluşturmanın adım adım rehberi.",
    url: "https://qefmenu.com/blog/ucretsiz-dijital-menu-nasil-olusturulur",
    type: "article",
    publishedTime: "2025-03-15T00:00:00Z",
    modifiedTime: "2026-04-15T00:00:00Z",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Ücretsiz Dijital Menü Nasıl Oluşturulur?",
  description: "Hiç teknik bilgi gerektirmeden 5 dakikada ücretsiz dijital QR menü oluşturmanın adım adım rehberi.",
  url: "https://qefmenu.com/blog/ucretsiz-dijital-menu-nasil-olusturulur",
  datePublished: "2025-03-15T00:00:00Z",
  dateModified: "2026-04-15T00:00:00Z",
  author: { "@type": "Organization", name: "Qef", url: "https://qefmenu.com" },
  publisher: { "@type": "Organization", name: "Qef", logo: { "@type": "ImageObject", url: "https://qefmenu.com/favicon.svg" } },
  inLanguage: "tr",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://qefmenu.com/blog/ucretsiz-dijital-menu-nasil-olusturulur" },
};

export default function Post2() {
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
            <time dateTime="2025-03-15">15 Mart 2025</time>
            <span>·</span>
            <span>5 dk okuma</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Ücretsiz Dijital Menü Nasıl Oluşturulur?
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Teknik bilgiye gerek yok, yazılım indirmenize gerek yok. Sadece 5 adımda ücretsiz dijital menünüzü oluşturun.
          </p>
        </div>

        <hr className="border-gray-100" />

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <p>
            Dijital menü oluşturmak artık web tasarımcısı tutmayı ya da aylık abonelik ödemeyi gerektirmiyor. <strong>Qef</strong> ile bu işi tamamen ücretsiz, 5 dakikada yapabilirsiniz. İşte adım adım nasıl yapacağınız:
          </p>

          <h2 className="text-xl font-bold text-gray-900">Adım 1: Ücretsiz Hesap Oluşturun</h2>
          <p>
            <Link href="/register" className="text-orange-500 font-medium hover:underline">qefmenu.com/register</Link> adresine gidin. E-posta adresinizi ve şifrenizi girin. Birkaç saniye içinde hesabınız hazır. Kredi kartı istenmez, ücret alınmaz.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Adım 2: Kafe Bilgilerinizi Girin</h2>
          <p>
            Admin paneline girdikten sonra kafenizin adını, kısa açıklamasını ve menü URL'ini belirleyin. Bu URL, müşterilerinizin menünüze ulaşacağı adres olacak. Örneğin: <span className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">qefmenu.com/menu/arme-cafe</span>
          </p>

          <h2 className="text-xl font-bold text-gray-900">Adım 3: Logo ve Kapak Fotoğrafı Ekleyin</h2>
          <p>
            Kafenizin kimliğini yansıtmak için logo ve kapak görseli yükleyin. Renk temanızı ve yazı tipinizi de özelleştirebilirsiniz. Menünüz tam anlamıyla size özel görünecek.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Adım 4: Ürünlerinizi Ekleyin</h2>
          <p>
            Ürünler sekmesinden kategorilerinizi oluşturun — Kahveler, Tatlılar, Soğuk İçecekler gibi. Her kategori altına ürünlerinizi ekleyin: isim, fiyat, açıklama ve fotoğraf. İstediğiniz kadar ürün ekleyebilirsiniz, herhangi bir sınır yok.
          </p>
          <p>
            İpucu: Ürünlere "Yeni", "Popüler" veya "Vejetaryen" gibi etiketler ekleyerek öne çıkarabilirsiniz.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Adım 5: QR Kodunuzu İndirin ve Yazdırın</h2>
          <p>
            Admin panelinin sağ üstündeki QR butonuna tıklayın. Kodunuz otomatik oluşturulmuş olacak — indirin ve masalarınıza koyun. Müşterileriniz telefonlarının kamerasıyla tarayarak menünüze anında ulaşır.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 space-y-2 border border-gray-100">
            <p className="font-semibold text-gray-800">Menünüzü Sonradan Değiştirebilir misiniz?</p>
            <p className="text-sm text-gray-500">
              Evet, istediğiniz zaman. Fiyat güncelleyin, ürün ekleyin veya kaldırın — değişiklikler anında yayına girer. QR kodunuzu yeniden yazdırmanıza gerek yok.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">Ne Kadara Mal Olur?</h2>
          <p>
            Hiçbir şeye. Qef tamamen ücretsizdir. Sınırsız ürün, iki dil desteği, özel QR kodu — hepsi dahil, hiçbir ücret yok.
          </p>

        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center space-y-4">
          <p className="font-bold text-gray-900">Hemen deneyin — 5 dakika yeterli</p>
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
