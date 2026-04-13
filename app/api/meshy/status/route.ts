export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return Response.json({ error: "taskId gerekli" }, { status: 400 });
  }

  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) return Response.json({ error: "MESHY_API_KEY tanımlı değil" }, { status: 500 });

  const res = await fetch(`https://api.meshy.ai/openapi/v2/text-to-3d/${taskId}`, {
    headers: { "Authorization": `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: err }, { status: res.status });
  }

  const data = await res.json();

  return Response.json({
    status: data.status,           // PENDING | IN_PROGRESS | SUCCEEDED | FAILED
    progress: data.progress ?? 0,
    glbUrl: data.model_urls?.glb ?? null,
  });
}
