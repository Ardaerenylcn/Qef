"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const supabase = await createClient();
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  await verifySuperAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: userEmail,
    options: { redirectTo: "https://qefmenu.com/auth/magic" },
  });

  if (error) return { error: `Hata: ${error.message}` };

  const link = (data as any)?.properties?.action_link ?? (data as any)?.action_link;
  if (!link) return { error: "Link oluşturulamadı" };

  // Audit log (best-effort, non-blocking)
  void admin.from("superadmin_audit_log").insert({
    action: "impersonate",
    actor_id: adminUser?.id ?? "unknown",
    target_user_id: userId,
    target_email: userEmail,
  });

  return { link };
}

const RESERVED_SLUGS = new Set([
  "api", "admin", "auth", "superadmin", "login", "register",
  "forgot-password", "reset-password", "blog", "privacy", "terms",
  "sitemap", "robots", "favicon", "og-image", "ads",
]);

export async function deleteUnverifiedUserAction(userId: string) {
  const admin = await verifySuperAdmin();
  await admin.auth.admin.deleteUser(userId);
}

export async function activatePlanAction(cafeId: string) {
  const admin = await verifySuperAdmin();
  const proEndsAt = new Date();
  proEndsAt.setFullYear(proEndsAt.getFullYear() + 1);
  const { error } = await admin
    .from("cafes")
    .update({ plan: "pro", pro_ends_at: proEndsAt.toISOString() })
    .eq("id", cafeId);
  if (error) return { error: "Aktivasyon başarısız" };
  return { success: true };
}

export async function deactivatePlanAction(cafeId: string) {
  const admin = await verifySuperAdmin();
  const { error } = await admin
    .from("cafes")
    .update({ plan: "free", pro_ends_at: null })
    .eq("id", cafeId);
  if (error) return { error: "İşlem başarısız" };
  return { success: true };
}

export async function revalidateCafeMenuAction(slug: string) {
  await verifySuperAdmin();
  revalidatePath(`/menu/${slug}`);
  return { success: true };
}

export async function setAiScanLimitAction(cafeId: string, limit: number) {
  const admin = await verifySuperAdmin();
  const { error } = await admin
    .from("cafes")
    .update({ ai_scan_limit: limit })
    .eq("id", cafeId);
  if (error) return { error: "Limit güncellenemedi" };
  return { success: true };
}

export async function resetAiScanCountAction(cafeId: string) {
  const admin = await verifySuperAdmin();
  const { error } = await admin
    .from("cafes")
    .update({ ai_scan_count: 0 })
    .eq("id", cafeId);
  if (error) return { error: "Sıfırlama başarısız" };
  return { success: true };
}

export async function updateSlugAction(cafeId: string, newSlug: string) {
  const admin = await verifySuperAdmin();

  const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (!slug) return { error: "Geçersiz slug" };
  if (RESERVED_SLUGS.has(slug)) return { error: "Bu slug kullanılamaz (rezerve edilmiş)" };

  const { data: existing } = await admin.from("cafes").select("slug").eq("id", cafeId).single();

  const { error } = await admin
    .from("cafes")
    .update({ slug })
    .eq("id", cafeId);

  if (error) return { error: "Slug zaten kullanımda olabilir" };

  if (existing?.slug) revalidatePath(`/menu/${existing.slug}`);
  revalidatePath(`/menu/${slug}`);

  return { success: true };
}
