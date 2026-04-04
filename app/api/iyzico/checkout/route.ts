import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createIyzipay } from "@/lib/iyzico";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const admin = createAdminClient();
  const { data: cafe } = await admin
    .from("cafes")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  if (!cafe) return NextResponse.json({ error: "Kafe bulunamadı" }, { status: 404 });

  const iyzipay = createIyzipay();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const conversationId = `${cafe.id}-${Date.now()}`;

  // Pending ödeme kaydı oluştur
  await admin.from("payments").insert({
    cafe_id: cafe.id,
    user_id: user.id,
    status: "pending",
    amount: 4999,
  });

  const request = {
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
      name: cafe.name ?? "Kafe Sahibi",
      surname: "-",
      gsmNumber: "+905000000000",
      email: user.email ?? "musteri@example.com",
      identityNumber: "74300864791",
      registrationAddress: "Türkiye",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: {
      contactName: cafe.name ?? "Kafe Sahibi",
      city: "Istanbul",
      country: "Turkey",
      address: "Türkiye",
    },
    billingAddress: {
      contactName: cafe.name ?? "Kafe Sahibi",
      city: "Istanbul",
      country: "Turkey",
      address: "Türkiye",
    },
    basketItems: [
      {
        id: "qef-pro-1year",
        name: "Qef Pro Plan — 1 Yıllık",
        category1: "Yazılım",
        itemType: "VIRTUAL",
        price: "4999.00",
      },
    ],
  };

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: Record<string, unknown>) => {
      if (err) {
        console.error("iyzico err:", err);
        resolve(NextResponse.json({ error: "iyzico err", detail: String(err) }, { status: 500 }));
        return;
      }
      if (result.status !== "success") {
        console.error("iyzico result:", JSON.stringify(result));
        resolve(NextResponse.json({ error: "iyzico failed", detail: result.errorMessage ?? result }, { status: 500 }));
        return;
      }
      resolve(NextResponse.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
      }));
    });
  });
}
