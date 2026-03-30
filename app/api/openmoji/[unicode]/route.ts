import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ unicode: string }> }) {
  const { unicode } = await params;
  // Sadece geçerli hex karakterlere izin ver
  if (!/^[0-9A-Fa-f-]+$/.test(unicode)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const svg = readFileSync(
      join(process.cwd(), "node_modules/openmoji/color/svg", `${unicode.toUpperCase()}.svg`)
    );
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
