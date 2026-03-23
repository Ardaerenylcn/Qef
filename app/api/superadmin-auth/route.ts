import { NextRequest, NextResponse } from "next/server";

async function generateSessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("qefmenu-sa-session-v1")
  );
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.SUPER_ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
  }

  const token = await generateSessionToken(process.env.SUPER_ADMIN_PASSWORD!);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sa_verified", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("sa_verified");
  return response;
}
