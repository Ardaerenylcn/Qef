import type { Metadata } from "next";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — Qef",
  description: "Qef kullanım koşulları. Hizmetimizi kullanarak kabul ettiğiniz kurallar ve yükümlülükler.",
  alternates: { canonical: "https://qefmenu.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
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

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-gray-700">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">Kullanım Koşulları</h1>
          <p className="text-sm text-gray-400">Son güncelleme: Mart 2025</p>
        </div>

        <p className="leading-relaxed">
          <strong>qefmenu.com</strong> adresini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          Lütfen bu sayfayı dikkatlice okuyun.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">1. Hizmet Tanımı</h2>
          <p className="text-sm leading-relaxed">
            Qef, kafe ve restoran sahiplerine dijital QR menü oluşturma, yönetme ve yayınlama
            hizmeti sunan bir web platformudur. Hizmet ücretsiz olarak sunulmakta olup ek özellikler
            gelecekte ücretli plan kapsamında sunulabilir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">2. Hesap Oluşturma</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm">
            <li>Hesap açmak için geçerli bir e-posta adresi gereklidir.</li>
            <li>Hesap güvenliğinden kullanıcı sorumludur.</li>
            <li>Bir kullanıcı birden fazla kafe hesabı oluşturabilir.</li>
            <li>18 yaşından küçük kullanıcıların ebeveyn izni alması gerekmektedir.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">3. İçerik Kuralları</h2>
          <p className="text-sm leading-relaxed">Platformumuza yüklediğiniz içerikler:</p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm">
            <li>Gerçek ve doğru bilgiler içermelidir.</li>
            <li>Telif hakkı ihlali içermemelidir.</li>
            <li>Yanıltıcı, zararlı veya yasadışı içerik barındırmamalıdır.</li>
            <li>Yalnızca gıda ve içecek menüsüne yönelik olmalıdır.</li>
          </ul>
          <p className="text-sm leading-relaxed">
            Bu kurallara aykırı içerikler önceden bildirim yapılmaksızın kaldırılabilir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">4. Fikri Mülkiyet</h2>
          <p className="text-sm leading-relaxed">
            Platforma yüklediğiniz görsel ve metinlerin telif hakkı size aittir. Qef, bu
            içerikleri yalnızca hizmetin sunulması amacıyla kullanır. Platform tasarımı, yazılımı
            ve markası Qef&apos;e aittir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">5. Reklamlar</h2>
          <p className="text-sm leading-relaxed">
            Ücretsiz plan kapsamındaki menü sayfalarında Google AdSense aracılığıyla reklam
            gösterilebilir. Reklamlar Google&apos;ın politikaları çerçevesinde sunulur ve Qef bu
            reklamların içeriğinden sorumlu değildir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">6. Hizmetin Sürekliliği</h2>
          <p className="text-sm leading-relaxed">
            Qef, hizmetin kesintisiz çalışacağını garanti etmez. Bakım, güncelleme veya
            beklenmedik teknik sorunlar nedeniyle hizmet geçici olarak kullanılamayabilir.
            Veri kaybını önlemek için verilerinizi düzenli olarak yedeklemenizi öneririz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">7. Hesap Sonlandırma</h2>
          <p className="text-sm leading-relaxed">
            Kullanım koşullarını ihlal eden hesaplar önceden bildirim yapılmaksızın askıya alınabilir
            veya silinebilir. Hesabınızı dilediğiniz zaman admin panelinden veya e-posta ile talep
            ederek silebilirsiniz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">8. Sorumluluk Sınırlaması</h2>
          <p className="text-sm leading-relaxed">
            Qef, platformun kullanımından kaynaklanabilecek dolaylı zararlardan sorumlu tutulamaz.
            Menüdeki fiyat, içerik veya stok bilgilerinin doğruluğu tamamen kullanıcının sorumluluğundadır.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">9. Değişiklikler</h2>
          <p className="text-sm leading-relaxed">
            Bu koşullar zaman zaman güncellenebilir. Önemli değişiklikler e-posta ile bildirilir.
            Hizmeti kullanmaya devam etmek, güncel koşulları kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">10. İletişim</h2>
          <p className="text-sm leading-relaxed">
            Sorularınız için{" "}
            <a href="mailto:destek@qefmenu.com" className="text-orange-500 underline">
              destek@qefmenu.com
            </a>{" "}
            adresine yazabilirsiniz.
          </p>
        </section>
      </div>

      <footer className="text-center text-xs text-gray-300 pb-10 pt-6 border-t border-gray-100">
        <p>© 2025 Qef ·{" "}
          <Link href="/terms" className="hover:text-orange-400 transition-colors">Kullanım Koşulları</Link>
          {" "}·{" "}
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik Politikası</Link>
        </p>
      </footer>
    </main>
  );
}
