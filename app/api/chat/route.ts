import { streamText, convertToModelMessages } from "ai";
import { createVertex } from "@ai-sdk/google-vertex";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 30;

const DAILY_LIMIT = 7;

async function checkRateLimit(ip: string): Promise<boolean> {
  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await admin
    .from("chat_rate_limit")
    .select("count")
    .eq("ip", ip)
    .eq("date", today)
    .single();

  if (data && data.count >= DAILY_LIMIT) return false;

  if (data) {
    await admin
      .from("chat_rate_limit")
      .update({ count: data.count + 1 })
      .eq("ip", ip)
      .eq("date", today);
  } else {
    await admin
      .from("chat_rate_limit")
      .insert({ ip, date: today, count: 1 });
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Günlük mesaj limitine ulaştınız." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

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
Ürünleri tanıtırken fiyatlardan bahsetme. Sipariş almıyorsun, sadece öneri ve bilgi veriyorsun.
ÖNEMLI: Cevaplarında kesinlikle markdown kullanma. Yıldız (*), çift yıldız (**), tire listesi (-), başlık (#) gibi işaretler kullanma. Düz metin yaz.

Menü:
${JSON.stringify(productList, null, 2)}`;

    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!);
    const vertex = createVertex({
      project: credentials.project_id,
      location: "us-central1",
      googleAuthOptions: { credentials },
    });

    const result = streamText({
      model: vertex("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[chat/route] hata:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Bilinmeyen hata" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
