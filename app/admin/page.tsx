import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/AdminHeader";
import AdminTabs from "@/components/AdminTabs";
import AdminInbox from "@/components/AdminInbox";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: cafe }, { data: messages }] = await Promise.all([
    supabase.from("cafes").select("slug, name").eq("user_id", user.id).single(),
    supabase.from("messages").select("id, title, body, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

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
