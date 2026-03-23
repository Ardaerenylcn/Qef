import type { Metadata } from "next";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Qef",
  description: "Qef gizlilik politikası. Kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu öğrenin.",
  alternates: { canonical: "https://qefmenu.com/privacy" },
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-extrabold text-gray-900">Gizlilik Politikası</h1>
          <p className="text-sm text-gray-400">Son güncelleme: Mart 2025</p>
        </div>

        <p className="leading-relaxed">
          Qef (&quot;biz&quot;, &quot;bizim&quot;) olarak gizliliğinize önem veriyoruz. Bu politika, <strong>qefmenu.com</strong> adresini
          kullandığınızda hangi bilgileri topladığımızı, bu bilgileri nasıl kullandığımızı ve
          haklarınızın neler olduğunu açıklar.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">1. Topladığımız Bilgiler</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm">
            <li><strong>Hesap bilgileri:</strong> Kayıt olduğunuzda e-posta adresinizi alırız.</li>
            <li><strong>Menü içeriği:</strong> Kafe adı, ürünler, fiyatlar ve görseller gibi sizin girdiğiniz bilgileri saklarız.</li>
            <li><strong>Kullanım verileri:</strong> Menü sayfalarının kaç kez görüntülendiğini (ziyaretçi sayısı) anonim olarak kaydederiz. Ziyaretçilerin kişisel bilgileri toplanmaz.</li>
            <li><strong>Çerezler:</strong> Oturum yönetimi için zorunlu çerezler kullanılır.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">2. Bilgileri Nasıl Kullanırız</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm">
            <li>Hesabınızı oluşturmak ve yönetmek için.</li>
            <li>Menünüzü yayınlamak ve size ait QR kodunu oluşturmak için.</li>
            <li>Hizmet iyileştirme ve hata tespiti için.</li>
            <li>Güvenlik ve dolandırıcılık önleme için.</li>
          </ul>
          <p className="text-sm leading-relaxed">
            Kişisel verilerinizi üçüncü taraflara satmıyor veya pazarlama amaçlı paylaşmıyoruz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">3. Google AdSense</h2>
          <p className="text-sm leading-relaxed">
            Menü sayfalarında Google AdSense aracılığıyla reklam gösterilmektedir. Google,
            reklam sunmak için çerezler ve benzeri teknolojiler kullanabilir. Google&apos;ın
            gizlilik politikası hakkında daha fazla bilgi için{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
              className="text-orange-500 underline">
              policies.google.com/privacy
            </a>{" "}
            adresini ziyaret edebilirsiniz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">4. Veri Saklama</h2>
          <p className="text-sm leading-relaxed">
            Hesabınızı sildiğinizde verileriniz kalıcı olarak kaldırılır. Anonim ziyaret istatistikleri
            hizmet iyileştirme amacıyla daha uzun süre saklanabilir.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">5. Güvenlik</h2>
          <p className="text-sm leading-relaxed">
            Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. Tüm
            iletişim HTTPS üzerinden şifrelenir. Şifreler asla düz metin olarak saklanmaz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">6. Haklarınız</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm">
            <li>Hakkınızdaki verilere erişim talep edebilirsiniz.</li>
            <li>Yanlış verilerin düzeltilmesini isteyebilirsiniz.</li>
            <li>Hesabınızı ve verilerinizi silebilirsiniz.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">7. İletişim</h2>
          <p className="text-sm leading-relaxed">
            Gizlilik politikamızla ilgili sorularınız için{" "}
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
