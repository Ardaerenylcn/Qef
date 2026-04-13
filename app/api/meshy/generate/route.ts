import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { cafeId, prompt } = await req.json();

  if (!cafeId || !prompt) {
    return Response.json({ error: "cafeId ve prompt gerekli" }, { status: 400 });
  }

  // Kullanıcının bu kafe sahibi olduğunu doğrula
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Yetkisiz" }, { status: 401 });

  const { data: cafe } = await supabase
    .from("cafes")
    .select("id")
    .eq("id", cafeId)
    .eq("user_id", user.id)
    .single();

  if (!cafe) return Response.json({ error: "Kafe bulunamadı" }, { status: 403 });

  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) return Response.json({ error: "MESHY_API_KEY tanımlı değil" }, { status: 500 });

  const res = await fetch("https://api.meshy.ai/openapi/v2/text-to-3d", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "preview",
      prompt,
      art_style: "realistic",
      should_remesh: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  return Response.json({ taskId: data.result });
}
