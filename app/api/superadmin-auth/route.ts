import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.SUPER_ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sa_verified", process.env.SUPER_ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 saat
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("sa_verified");
  return response;
}
