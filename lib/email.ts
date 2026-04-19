import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Qef <bildirim@qefmenu.com>";

export async function sendTrialReminder(to: string, daysLeft: number, cafeName: string) {
  const urgent = daysLeft <= 1;
  await resend.emails.send({
    from: FROM,
    to,
    subject: urgent
      ? "⏰ Deneme süreniz yarın bitiyor!"
      : `${daysLeft} gün sonra deneme süreniz bitiyor`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h2 style="color:#f97316;margin:0 0 8px">${urgent ? "Deneme süreniz yarın bitiyor!" : `${daysLeft} gün kaldı`}</h2>
        <p style="color:#555;margin:0 0 24px">Merhaba! <strong>${cafeName}</strong> için Qef deneme süreniz <strong>${daysLeft} gün</strong> içinde sona eriyor.</p>
        <p style="color:#555;margin:0 0 24px">Menünüze erişimi kesintisiz sürdürmek için Pro plana geçin.</p>
        <a href="https://qefmenu.com/upgrade" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">Pro Ol — 4.999₺/yıl</a>
        <p style="color:#aaa;font-size:12px;margin:32px 0 0">Qef · qefmenu.com</p>
      </div>
    `,
  });
}

export async function sendRenewalReminder(to: string, proEndsAt: Date, cafeName: string) {
  const days = Math.ceil((proEndsAt.getTime() - Date.now()) / 86400000);
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Pro planınız ${days} gün içinde yenileniyor`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h2 style="color:#f97316;margin:0 0 8px">Pro planınız yakında sona eriyor</h2>
        <p style="color:#555;margin:0 0 24px">Merhaba! <strong>${cafeName}</strong> için Qef Pro planınız <strong>${proEndsAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</strong> tarihinde sona eriyor.</p>
        <p style="color:#555;margin:0 0 24px">Kesintisiz hizmet için planınızı yenileyin.</p>
        <a href="https://qefmenu.com/upgrade" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">Planı Yenile — 4.999₺/yıl</a>
        <p style="color:#aaa;font-size:12px;margin:32px 0 0">Qef · qefmenu.com</p>
      </div>
    `,
  });
}

export async function sendProWelcome(to: string, cafeName: string, proEndsAt: Date) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Qef Pro'ya hoş geldiniz 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h2 style="color:#f97316;margin:0 0 8px">Teşekkürler! 🙏</h2>
        <p style="color:#555;margin:0 0 16px">Merhaba! <strong>${cafeName}</strong> için Qef Pro planına geçtiğiniz için çok teşekkür ederiz.</p>
        <p style="color:#555;margin:0 0 24px">Planınız <strong>${proEndsAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</strong> tarihine kadar geçerli. Bu süre boyunca tüm Pro özelliklerine sınırsız erişiminiz var.</p>
        <a href="https://qefmenu.com/admin" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">Admin Paneline Git</a>
        <p style="color:#555;font-size:14px;margin:28px 0 0">Herhangi bir sorunuz olursa <a href="mailto:destek@qefmenu.com" style="color:#f97316">destek@qefmenu.com</a> adresinden bize ulaşabilirsiniz.</p>
        <p style="color:#aaa;font-size:12px;margin:24px 0 0">Qef · qefmenu.com</p>
      </div>
    `,
  });
}

export async function sendPaymentReceipt(to: string, cafeName: string, paymentId: string, proEndsAt: Date) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "✅ Ödeme alındı — Qef Pro aktif!",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h2 style="color:#16a34a;margin:0 0 8px">Pro planınız aktif! 🎉</h2>
        <p style="color:#555;margin:0 0 24px">Merhaba! <strong>${cafeName}</strong> için ödemeniz başarıyla alındı.</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:10px 0;color:#888;font-size:14px">Plan</td>
            <td style="padding:10px 0;font-weight:600;text-align:right">Qef Pro — 1 Yıl</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:10px 0;color:#888;font-size:14px">Tutar</td>
            <td style="padding:10px 0;font-weight:600;text-align:right">4.999,00 ₺</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:10px 0;color:#888;font-size:14px">İşlem No</td>
            <td style="padding:10px 0;font-weight:600;text-align:right;font-size:13px">${paymentId}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#888;font-size:14px">Geçerlilik</td>
            <td style="padding:10px 0;font-weight:600;text-align:right">${proEndsAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</td>
          </tr>
        </table>
        <a href="https://qefmenu.com/admin" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">Admin Paneline Git</a>
        <p style="color:#aaa;font-size:12px;margin:32px 0 0">Qef · qefmenu.com · iyzico altyapısı ile güvenli ödeme</p>
      </div>
    `,
  });
}
