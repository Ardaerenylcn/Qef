import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Users,
  Coffee,
  UtensilsCrossed,
  Eye,
  TrendingUp,
  MailCheck,
} from "lucide-react";
import SuperAdminLogout from "@/components/SuperAdminLogout";
import SuperAdminCafeCard from "@/components/SuperAdminCafeCard";
import SuperAdminConfirmationList from "@/components/SuperAdminConfirmationList";

export default async function SuperAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect("/");
  }

  const admin = createAdminClient();

  const [
    { count: userCount },
    { count: cafeCount },
    { count: productCount },
    { count: viewCount },
    { data: allCafes },
    { data: allViews },
    { data: recentViews },
    { data: { users: authUsers } },
  ] = await Promise.all([
    admin.from("cafes").select("*", { count: "exact", head: true }),
    admin.from("cafes").select("*", { count: "exact", head: true }),
    admin.from("products").select("*", { count: "exact", head: true }),
    admin.from("menu_views").select("*", { count: "exact", head: true }),
    admin
      .from("cafes")
      .select("id, name, slug, created_at, user_id, theme, plan, trial_ends_at, pro_ends_at, ai_scan_count, ai_scan_limit, products(count)")
      .order("created_at", { ascending: false }),
    admin.from("menu_views").select("cafe_id"),
    admin
      .from("menu_views")
      .select("viewed_at")
      .gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("viewed_at", { ascending: true }),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  // user_id → { email, phone }
  const userMap: Record<string, { email: string; phone: string }> = {};
  (authUsers ?? []).forEach((u) => {
    userMap[u.id] = {
      email: u.email ?? "",
      phone: (u.user_metadata?.phone as string) ?? "",
    };
  });

  // Son gönderilen doğrulama mailleri (doğrulansın ya da doğrulanmasın)
  const recentConfirmations = (authUsers ?? [])
    .filter((u) => u.confirmation_sent_at)
    .sort((a, b) => new Date(b.confirmation_sent_at!).getTime() - new Date(a.confirmation_sent_at!).getTime())
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      phone: (u.user_metadata?.phone as string) ?? (u.phone ?? ""),
      confirmation_sent_at: u.confirmation_sent_at!,
      confirmed: !!u.email_confirmed_at,
    }));

  // Cafe bazında toplam görüntülenme sayısı
  const viewsPerCafe: Record<string, number> = {};
  (allViews ?? []).forEach((v: any) => {
    viewsPerCafe[v.cafe_id] = (viewsPerCafe[v.cafe_id] ?? 0) + 1;
  });

  // Son 7 gün grafik
  const viewsByDay: Record<string, number> = {};
  (recentViews ?? []).forEach((v) => {
    const day = new Date(v.viewed_at).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" });
    viewsByDay[day] = (viewsByDay[day] ?? 0) + 1;
  });

  const stats = [
    { label: "Toplam Hesap", value: userCount ?? 0, icon: Users, color: "bg-blue-50 text-blue-500" },
    { label: "Toplam Kafe", value: cafeCount ?? 0, icon: Coffee, color: "bg-orange-50 text-orange-500" },
    { label: "Toplam Ürün", value: productCount ?? 0, icon: UtensilsCrossed, color: "bg-green-50 text-green-500" },
    { label: "Toplam Görüntülenme", value: viewCount ?? 0, icon: Eye, color: "bg-purple-50 text-purple-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Başlık */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Paneli</h1>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Admin Paneli →
            </Link>
            <SuperAdminLogout />
          </div>
        </div>

        {/* Özet Kartlar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className={`inline-flex p-2 rounded-xl ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value.toLocaleString("tr-TR")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Son 7 Gün Görüntülenme */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-gray-700">Son 7 Gün Görüntülenme</h2>
          </div>
          {Object.keys(viewsByDay).length === 0 ? (
            <p className="text-sm text-gray-300 py-4 text-center">Henüz veri yok</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(viewsByDay).map(([day, count]) => {
                const max = Math.max(...Object.values(viewsByDay));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16 shrink-0">{day}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Son Gönderilen Doğrulama Mailleri */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MailCheck className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-gray-700">Son Gönderilen Doğrulama Mailleri</h2>
            <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
              {recentConfirmations.length}
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recentConfirmations.length === 0 ? (
              <p className="text-sm text-gray-300 py-6 text-center">Henüz veri yok</p>
            ) : (
              <SuperAdminConfirmationList items={recentConfirmations} />
            )}
          </div>
        </div>

        {/* Tüm Kafeler */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-gray-700">Tüm Kafeler</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {(allCafes ?? []).length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(allCafes ?? []).map((cafe: any) => (
              <SuperAdminCafeCard
                key={cafe.id}
                cafe={cafe}
                views={viewsPerCafe[cafe.id] ?? 0}
                userInfo={userMap[cafe.user_id] ?? { email: "", phone: "" }}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
