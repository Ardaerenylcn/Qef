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
    supabase.from("cafes").select("id, slug, name").eq("user_id", user.id).single(),
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

  // İstatistikler — son 30 günün view'larını çek
  const stats = { todayCount: 0, weekCount: 0, monthCount: 0, dailyData: [] as { date: string; count: number }[], peakHour: 0, hourlyData: [] as { hour: number; count: number }[] };
  if (cafe?.id) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: viewsData } = await supabase
      .from("menu_views")
      .select("viewed_at")
      .eq("cafe_id", cafe.id)
      .gte("viewed_at", thirtyDaysAgo.toISOString());

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    stats.todayCount = viewsData?.filter(v => new Date(v.viewed_at) >= todayMidnight).length ?? 0;
    stats.weekCount = viewsData?.filter(v => new Date(v.viewed_at) >= sevenDaysAgo).length ?? 0;
    stats.monthCount = viewsData?.length ?? 0;

    // Son 7 günlük günlük dağılım
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    viewsData?.forEach(v => {
      const key = v.viewed_at.slice(0, 10);
      if (key in dailyMap) dailyMap[key]++;
    });
    stats.dailyData = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // Saatlik dağılım
    const hourlyMap: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourlyMap[h] = 0;
    viewsData?.forEach(v => { hourlyMap[new Date(v.viewed_at).getHours()]++; });
    stats.hourlyData = Object.keys(hourlyMap).map(h => ({ hour: Number(h), count: hourlyMap[Number(h)] }));
    stats.peakHour = stats.hourlyData.reduce((max, h) => h.count > max.count ? h : max, stats.hourlyData[0] ?? { hour: 0, count: 0 }).hour;
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
        <AdminTabs email={user.email ?? ""} stats={stats} />
      </div>
    </main>
  );
}
