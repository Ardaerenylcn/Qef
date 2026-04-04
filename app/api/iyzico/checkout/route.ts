import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCheckoutForm } from "@/lib/iyzico";

function toAscii(str: string): string {
  return str
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
    .replace(/[^a-zA-Z0-9 _\-.,]/g, "");
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const admin = createAdminClient();
    const { data: cafe } = await admin
      .from("cafes").select("id, name").eq("user_id", user.id).single();

    if (!cafe) return NextResponse.json({ error: "Kafe bulunamadı" }, { status: 404 });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const conversationId = `${cafe.id}-${Date.now()}`;
    const cafeName = toAscii(cafe.name ?? "Kafe Sahibi") || "Kafe Sahibi";

    await admin.from("payments").insert({
      cafe_id: cafe.id, user_id: user.id, status: "pending", amount: 4999,
    });

    const result = await createCheckoutForm({
      locale: "tr",
      conversationId,
      price: "4999.00",
      paidPrice: "4999.00",
      currency: "TRY",
      basketId: cafe.id,
      paymentGroup: "PRODUCT",
      callbackUrl: `${siteUrl}/api/iyzico/callback`,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: user.id,
        name: cafeName,
        surname: ".",
        gsmNumber: "+905000000000",
        email: user.email ?? "musteri@example.com",
        identityNumber: "74300864791",
        registrationAddress: "Turkey",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
      },
      shippingAddress: { contactName: cafeName, city: "Istanbul", country: "Turkey", address: "Turkey" },
      billingAddress: { contactName: cafeName, city: "Istanbul", country: "Turkey", address: "Turkey" },
      basketItems: [{
        id: "qef-pro-1year",
        name: "Qef Pro Plan 1 Year",
        category1: "Software",
        itemType: "VIRTUAL",
        price: "4999.00",
      }],
    });

    if (result.status !== "success") {
      console.error("iyzico result:", JSON.stringify(result));
      return NextResponse.json(
        { error: "iyzico failed", detail: result.errorMessage ?? JSON.stringify(result) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
    });
  } catch (e) {
    console.error("checkout error:", e);
    return NextResponse.json({ error: "Sunucu hatası", detail: String(e) }, { status: 500 });
  }
}
