import { createVertex } from "@ai-sdk/google-vertex";
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const ResultSchema = z.object({
  products: z.array(
    z.object({
      index: z.number().describe("Görselin sıra numarası, 0'dan başlar"),
      name: z.string().describe("Ürünün kısa, iştah açıcı Türkçe adı"),
      name_en: z.string().describe("Ürünün İngilizce adı"),
      description: z.string().describe("Maksimum 60 karakter, tek cümle, iştah açıcı Türkçe açıklama. Nokta ile bitir."),
    })
  ),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Yetkisiz", { status: 401 });

  const body = await req.json() as { images: string[] };
  const { images } = body;

  if (!images?.length || images.length > 15) {
    return new Response("1–15 arası görsel gerekli", { status: 400 });
  }

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
    schema: ResultSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Sana ${images.length} adet kafe/restoran ürün görseli gönderiyorum.
Görseller sırasıyla 0'dan ${images.length - 1}'e kadar numaralandırılmıştır.
Her görsel için index numarasını, Türkçe adını, İngilizce adını ve kısa iştah açıcı Türkçe açıklamasını çıkar.
Sadece gördüğün ürünü tanımla, abartma.`,
          },
          ...images.map((base64, i) => ({
            type: "image" as const,
            image: base64,
            mimeType: "image/jpeg" as const,
          })),
        ],
      },
    ],
  });

  await supabase
    .from("cafes")
    .update({ ai_scan_count: scanCount + images.length })
    .eq("id", cafe.id);

  return Response.json({ ...object, scanCount: scanCount + images.length, scanLimit });
}
