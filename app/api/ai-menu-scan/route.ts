import { createVertex } from "@ai-sdk/google-vertex";
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const MenuScanSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().describe("Ürünün kısa Türkçe adı"),
      name_en: z.string().describe("Ürünün İngilizce adı"),
      description: z.string().describe("Maksimum 60 karakter, iştah açıcı Türkçe açıklama. Boşsa boş string."),
      category: z.string().describe("Ürünün ait olduğu kategori, menüdeki başlıklardan al. Bulamazsan 'Genel'"),
      price: z.string().describe("Sadece sayısal fiyat, örn: '150', '29.5'. Bulamazsan boş string."),
      calories: z.string().describe("Kalori değeri sadece sayı. Bulamazsan boş string."),
    })
  ),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Yetkisiz", { status: 401 });

  const body = await req.json() as { image: string };
  const { image } = body;

  if (!image) return new Response("Görsel gerekli", { status: 400 });

  const { data: cafe } = await supabase
    .from("cafes")
    .select("id, ai_scan_count, ai_scan_limit")
    .eq("user_id", user.id)
    .single();

  if (!cafe) return new Response("Kafe bulunamadı", { status: 404 });

  const scanCount = cafe.ai_scan_count ?? 0;
  const scanLimit = cafe.ai_scan_limit ?? 150;

  if (scanCount >= scanLimit) {
    return Response.json({ limitExceeded: true, scanCount, scanLimit }, { status: 429 });
  }

  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!);
  const vertex = createVertex({
    project: credentials.project_id,
    location: "us-central1",
    googleAuthOptions: { credentials },
  });

  const { object } = await generateObject({
    model: vertex("gemini-2.5-flash"),
    schema: MenuScanSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Bu bir kafe veya restoran menüsünün fotoğrafı.
Menüdeki tüm ürünleri, kategorileri ve fiyatları çıkar.
Her ürün için: Türkçe ad, İngilizce ad, kısa iştah açıcı açıklama (max 60 karakter), kategori, fiyat (sadece sayı, ₺ veya TL olmadan), kalori (varsa).
Kategorileri menüdeki başlıklardan/bölümlerden al.
Fiyat yoksa boş string bırak.`,
          },
          {
            type: "image" as const,
            image,
          },
        ],
      },
    ],
  });

  const productCount = object.products.length;
  const newScanCount = Math.min(scanCount + productCount, scanLimit);

  await supabase
    .from("cafes")
    .update({ ai_scan_count: newScanCount })
    .eq("id", cafe.id);

  return Response.json({ ...object, scanCount: newScanCount, scanLimit });
}
