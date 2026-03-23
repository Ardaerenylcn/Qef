import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminHeader from "@/components/AdminHeader";
import AdminTabs from "@/components/AdminTabs";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [{ data: cafe }, { data: existingMessages }] = await Promise.all([
    supabase.from("cafes").select("slug, name").eq("user_id", user.id).single(),
    supabase.from("messages").select("id").eq("user_id", user.id).limit(1),
  ]);

  // İlk girişte hoşgeldin mesajı gönder
  if (!existingMessages || existingMessages.length === 0) {
    await admin.from("messages").insert({
      user_id: user.id,
      title: "Qef'e Hoş Geldiniz! 🎉",
      body: "Merhaba!\n\nDijital menünüzü oluşturmak için doğru yerdesiniz. Hemen başlamak için:\n\n1. Admin panelinizden kafe adınızı ve bilgilerinizi girin\n2. Ürünlerinizi kategorilere göre ekleyin\n3. QR kodunuzu indirip masalara koyun\n\nHerhangi bir sorunuz olursa destek@qefmenu.com adresinden bize ulaşabilirsiniz.\n\nQef Ekibi",
    });
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, title, body, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-4 py-8 bg-gray-50">
      <AdminHeader
        slug={cafe?.slug ?? ""}
        cafeName={cafe?.name ?? "Kafem"}
        messages={messages ?? []}
      />

      <div className="max-w-lg mx-auto mb-4">
        <p className="text-xs text-gray-400">
          Giriş yapıldı: <span className="font-medium text-gray-500">{user.email}</span>
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <AdminTabs />
      </div>
    </main>
  );
}
