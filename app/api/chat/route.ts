import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, cafeId } = body;

  if (!cafeId) {
    return new Response("cafeId gerekli", { status: 400 });
  }

  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("name, chatbot_enabled")
    .eq("id", cafeId)
    .single();

  if (!cafe) {
    return new Response("Kafe bulunamadı", { status: 404 });
  }

  if (cafe.chatbot_enabled === false) {
    return new Response("Chatbot kapalı", { status: 403 });
  }

  const { data: products } = await supabase
    .from("products")
    .select("name, price, category, description, tags, in_stock")
    .eq("cafe_id", cafeId)
    .eq("in_stock", true)
    .order("position", { ascending: true });

  const productList = (products ?? []).map((p) => ({
    isim: p.name,
    fiyat: `${p.price} TL`,
    kategori: p.category,
    ...(p.description && { açıklama: p.description }),
    ...(Array.isArray(p.tags) && p.tags.length > 0 && { etiketler: p.tags }),
  }));

  const systemPrompt = `Sen ${cafe.name} restoranının dijital menü asistanısın.
Müşterilere menüdeki ürünler hakkında yardımcı ol. SADECE bu menüdeki ürünler hakkında konuş.
Kısa ve samimi cevaplar ver. Müşteri Türkçe yazarsa Türkçe, İngilizce yazarsa İngilizce cevapla.
Öneri yaparken fiyatları ve açıklamaları aktarabilirsin. Sipariş almıyorsun, sadece öneri ve bilgi veriyorsun.

Menü:
${JSON.stringify(productList, null, 2)}`;

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
  });

  return result.toUIMessageStreamResponse();
}
