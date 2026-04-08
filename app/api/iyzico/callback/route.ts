import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutForm } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(new URL("/admin?payment=error", siteUrl));
  }

  try {
    const result = await retrieveCheckoutForm({ locale: "tr", token });

    if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
      console.error("iyzico callback failed:", JSON.stringify(result));
      return NextResponse.redirect(new URL("/admin?payment=error", siteUrl));
    }

    const cafeId = result.basketId as string;
    if (!cafeId) {
      return NextResponse.redirect(new URL("/admin?payment=error", siteUrl));
    }

    const admin = createAdminClient();

    const { data: cafe } = await admin
      .from("cafes")
      .select("plan, pro_ends_at")
      .eq("id", cafeId)
      .single();

    const base =
      cafe?.plan === "pro" && cafe?.pro_ends_at && new Date(cafe.pro_ends_at) > new Date()
        ? new Date(cafe.pro_ends_at)
        : new Date();

    base.setFullYear(base.getFullYear() + 1);

    await admin.from("cafes").update({
      plan: "pro",
      pro_ends_at: base.toISOString(),
    }).eq("id", cafeId);

    await admin.from("payments").update({
      iyzico_token: token,
      iyzico_payment_id: String(result.paymentId ?? ""),
      status: "success",
    }).eq("cafe_id", cafeId).eq("status", "pending");

    return NextResponse.redirect(new URL("/admin?payment=success", siteUrl));
  } catch (e) {
    console.error("callback error:", e);
    return NextResponse.redirect(new URL("/admin?payment=error", siteUrl));
  }
}
