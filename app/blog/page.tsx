import type { Metadata } from "next";
import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Kafe ve Restoran İpuçları | Qef",
  description: "QR menü, dijital menü ve kafe yönetimi hakkında ipuçları. Kafenizi dijitalleştirmek için rehberler.",
  alternates: { canonical: "https://qefmenu.com/blog" },
};

const posts = [
  {
    slug: "qr-menu-nedir",
    title: "QR Menü Nedir? Kafeniz İçin Neden Şart?",
    description: "QR menü teknolojisi nedir, nasıl çalışır ve kafenize ne gibi avantajlar sağlar? Tüm sorularınızın yanıtı bu yazıda.",
    date: "Mart 2025",
    readTime: "4 dk",
  },
  {
    slug: "ucretsiz-dijital-menu-nasil-olusturulur",
    title: "Ücretsiz Dijital Menü Nasıl Oluşturulur?",
    description: "Hiç teknik bilgi gerektirmeden 5 dakikada ücretsiz dijital QR menü oluşturmanın adım adım rehberi.",
    date: "Mart 2025",
    readTime: "5 dk",
  },
  {
    slug: "kagit-menuden-dijital-menuye-gecmenin-5-faydasi",
    title: "Kağıt Menüden Dijital Menüye Geçmenin 5 Faydası",
    description: "Kağıt menüler neden modası geçiyor? Dijital QR menüye geçen kafeler ne kazanıyor? İşte 5 somut fayda.",
    date: "Mart 2025",
    readTime: "3 dk",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-gray-900 text-xl tracking-tight">Qef</span>
        </Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
          ← Ana Sayfa
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 space-y-2">
          <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Blog</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Kafe & Dijital Menü Rehberi</h1>
          <p className="text-gray-400">QR menü ve kafe yönetimi hakkında faydalı yazılar.</p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-orange-100 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime} okuma</span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{post.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="text-center text-xs text-gray-300 pb-10 pt-6 border-t border-gray-100 mt-12">
        <p>© 2025 Qef ·{" "}
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik</Link>
          {" "}·{" "}
          <Link href="/terms" className="hover:text-orange-400 transition-colors">Kullanım Koşulları</Link>
        </p>
      </footer>
    </main>
  );
}
