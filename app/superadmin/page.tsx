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
  ExternalLink,
} from "lucide-react";
import SuperAdminLogout from "@/components/SuperAdminLogout";

export default async function SuperAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect("/");
  }

  const admin = createAdminClient();

  // Tüm istatistikleri paralel çek
  const [
    { count: userCount },
    { count: cafeCount },
    { count: productCount },
    { count: viewCount },
    { data: recentCafes },
    { data: topCafes },
  ] = await Promise.all([
    admin.from("cafes").select("*", { count: "exact", head: true }),
    admin.from("cafes").select("*", { count: "exact", head: true }),
    admin.from("products").select("*", { count: "exact", head: true }),
    admin.from("menu_views").select("*", { count: "exact", head: true }),
    // Son 10 kafe (en yeni)
    admin
      .from("cafes")
      .select("id, name, slug, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10),
    // En çok görüntülenen 10 kafe
    admin
      .from("menu_views")
      .select("cafe_id, cafes(name, slug)")
      .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  // Top kafeleri say
  const viewsByCafe: Record<string, { name: string; slug: string; count: number }> = {};
  (topCafes ?? []).forEach((v: any) => {
    const id = v.cafe_id;
    if (!viewsByCafe[id]) {
      viewsByCafe[id] = { name: v.cafes?.name ?? "-", slug: v.cafes?.slug ?? "", count: 0 };
    }
    viewsByCafe[id].count++;
  });
  const sortedTopCafes = Object.values(viewsByCafe)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Son 7 günlük günlük görüntülenme
  const { data: recentViews } = await admin
    .from("menu_views")
    .select("viewed_at")
    .gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("viewed_at", { ascending: true });

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
      <div className="max-w-4xl mx-auto space-y-8">

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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Son 7 Gün Görüntülenme */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h2 className="font-semibold text-gray-700">Son 7 Gün</h2>
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
                        <div
                          className="bg-purple-400 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Son 30 Gün En Çok Görüntülenen */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-400" />
              <h2 className="font-semibold text-gray-700">Son 30 Gün — En Çok Görüntülenen</h2>
            </div>
            {sortedTopCafes.length === 0 ? (
              <p className="text-sm text-gray-300 py-4 text-center">Henüz veri yok</p>
            ) : (
              <div className="space-y-2">
                {sortedTopCafes.map((cafe, i) => (
                  <div key={cafe.slug} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{cafe.name}</p>
                      <p className="text-xs text-gray-400">/menu/{cafe.slug}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">{cafe.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tüm Kafeler */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-gray-700">Son Kayıt Olan Kafeler</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {(recentCafes ?? []).map((cafe: any) => (
              <div key={cafe.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{cafe.name}</p>
                  <p className="text-xs text-gray-400">/menu/{cafe.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(cafe.created_at).toLocaleDateString("tr-TR")}
                  </span>
                  <a
                    href={`/menu/${cafe.slug}`}
                    target="_blank"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
