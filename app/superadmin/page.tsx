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

  const [
    { count: userCount },
    { count: cafeCount },
    { count: productCount },
    { count: viewCount },
    { data: allCafes },
    { data: allViews },
    { data: recentViews },
  ] = await Promise.all([
    admin.from("cafes").select("*", { count: "exact", head: true }),
    admin.from("cafes").select("*", { count: "exact", head: true }),
    admin.from("products").select("*", { count: "exact", head: true }),
    admin.from("menu_views").select("*", { count: "exact", head: true }),
    // Tüm kafeler — ürün sayısıyla birlikte
    admin
      .from("cafes")
      .select("id, name, slug, created_at, theme, products(count)")
      .order("created_at", { ascending: false }),
    // Tüm zamanların görüntülenmeleri (cafe_id bazlı saymak için)
    admin.from("menu_views").select("cafe_id"),
    // Son 7 günlük günlük görüntülenme
    admin
      .from("menu_views")
      .select("viewed_at")
      .gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("viewed_at", { ascending: true }),
  ]);

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
            {(allCafes ?? []).map((cafe: any) => {
              const productCount = cafe.products?.[0]?.count ?? 0;
              const views = viewsPerCafe[cafe.id] ?? 0;
              const primaryColor = cafe.theme?.primaryColor ?? "#f97316";
              const logoUrl = cafe.theme?.logoUrl;
              const isUuid = /^[0-9a-f-]{36}$/.test(cafe.slug ?? "");

              return (
                <div key={cafe.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                  {/* Renkli üst şerit */}
                  <div className="h-1.5" style={{ backgroundColor: primaryColor }} />

                  <div className="p-4 space-y-3">
                    {/* İsim + link */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoUrl} alt="logo"
                            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-100" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${primaryColor}22` }}>
                            <UtensilsCrossed className="w-4 h-4" style={{ color: primaryColor }} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{cafe.name}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {isUuid ? "slug yok" : `/menu/${cafe.slug}`}
                          </p>
                        </div>
                      </div>
                      {!isUuid && (
                        <a href={`/menu/${cafe.slug}`} target="_blank"
                          className="text-gray-300 hover:text-orange-400 transition-colors shrink-0 mt-0.5">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* İstatistikler */}
                    <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-gray-300" />
                        <span><span className="font-semibold text-gray-700">{productCount}</span> ürün</span>
                      </div>
                      <div className="w-px h-3 bg-gray-100" />
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Eye className="w-3.5 h-3.5 text-gray-300" />
                        <span><span className="font-semibold text-gray-700">{views.toLocaleString("tr-TR")}</span> görüntülenme</span>
                      </div>
                      <div className="ml-auto text-xs text-gray-300">
                        {new Date(cafe.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
