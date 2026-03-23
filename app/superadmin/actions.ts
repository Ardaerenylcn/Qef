"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";

async function verifySuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
    throw new Error("Yetkisiz");
  }
  return createAdminClient();
}

export async function deleteUserAction(userId: string, cafeId: string) {
  const admin = await verifySuperAdmin();

  // Ürünleri sil
  await admin.from("products").delete().eq("cafe_id", cafeId);
  // Görüntülenmeleri sil
  await admin.from("menu_views").delete().eq("cafe_id", cafeId);
  // Cafeyi sil
  await admin.from("cafes").delete().eq("id", cafeId);
  // Auth kullanıcısını sil
  await admin.auth.admin.deleteUser(userId);
}

export async function sendMessageAction(userId: string, title: string, body: string) {
  const admin = await verifySuperAdmin();
  const { error } = await admin.from("messages").insert({ user_id: userId, title, body });
  if (error) return { error: "Mesaj gönderilemedi" };
  return { success: true };
}

export async function impersonateUserAction(userId: string, userEmail: string) {
  await verifySuperAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: userEmail,
    options: { redirectTo: "https://qefmenu.com/admin" },
  });

  if (error || !data?.properties?.action_link) {
    return { error: "Giriş linki oluşturulamadı" };
  }

  return { link: data.properties.action_link };
}

export async function updateSlugAction(cafeId: string, newSlug: string) {
  const admin = await verifySuperAdmin();

  const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (!slug) return { error: "Geçersiz slug" };

  const { error } = await admin
    .from("cafes")
    .update({ slug })
    .eq("id", cafeId);

  if (error) return { error: "Slug zaten kullanımda olabilir" };
  return { success: true };
}
