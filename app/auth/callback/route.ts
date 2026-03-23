import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Hoşgeldin mesajı gönder
      const admin = createAdminClient();
      await admin.from("messages").insert({
        user_id: data.user.id,
        title: "Qef'e Hoş Geldiniz! 🎉",
        body: "Merhaba!\n\nDijital menünüzü oluşturmak için doğru yerdesiniz. Hemen başlamak için:\n\n1. Admin panelinizden kafe adınızı ve bilgilerinizi girin\n2. Ürünlerinizi kategorilere göre ekleyin\n3. QR kodunuzu indirip masalara koyun\n\nHerhangi bir sorunuz olursa destek@qefmenu.com adresinden bize ulaşabilirsiniz.\n\nQef Ekibi",
      });

      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
