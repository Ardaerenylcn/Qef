import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createIyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string;

  if (!token) {
    return NextResponse.redirect(new URL("/admin?payment=error", req.url));
  }

  const iyzipay = createIyzipay();

  return new Promise<Response>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: "tr", token }, async (err: unknown, result: Record<string, unknown>) => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

      if (err || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
        resolve(NextResponse.redirect(new URL("/admin?payment=error", siteUrl)));
        return;
      }

      const admin = createAdminClient();
      const conversationId = result.conversationId as string;
      const cafeId = conversationId?.split("-").slice(0, 5).join("-"); // uuid formatı

      if (!cafeId) {
        resolve(NextResponse.redirect(new URL("/admin?payment=error", siteUrl)));
        return;
      }

      // Pro bitiş tarihini hesapla — mevcut pro_ends_at varsa üstüne ekle
      const { data: cafe } = await admin
        .from("cafes")
        .select("plan, pro_ends_at")
        .eq("id", cafeId)
        .single();

      const base = cafe?.plan === "pro" && cafe?.pro_ends_at && new Date(cafe.pro_ends_at) > new Date()
        ? new Date(cafe.pro_ends_at)
        : new Date();

      base.setFullYear(base.getFullYear() + 1);

      // Cafes tablosunu güncelle
      await admin.from("cafes").update({
        plan: "pro",
        pro_ends_at: base.toISOString(),
      }).eq("id", cafeId);

      // Ödeme kaydını güncelle
      await admin.from("payments").update({
        iyzico_token: token,
        iyzico_payment_id: String(result.paymentId ?? ""),
        status: "success",
      }).eq("cafe_id", cafeId).eq("status", "pending");

      resolve(NextResponse.redirect(new URL("/admin?payment=success", siteUrl)));
    });
  });
}
