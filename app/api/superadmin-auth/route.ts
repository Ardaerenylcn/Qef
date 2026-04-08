import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

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
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count } = await getSupabase()
    .from("sa_login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", windowStart);

  return (count ?? 0) < MAX_ATTEMPTS;
}

async function recordAttempt(ip: string) {
  const supabase = getSupabase();
  await supabase.from("sa_login_attempts").insert({ ip });

  // 1 günden eski kayıtları temizle
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("sa_login_attempts").delete().lt("created_at", oneDayAgo);
}

export async function POST(request: NextRequest) {
  // Body size limit (~1KB is plenty for a password)
  const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
  if (contentLength > 1024) {
    return NextResponse.json({ error: "İstek çok büyük." }, { status: 413 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Çok fazla hatalı giriş. 15 dakika bekleyin." },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (!password || password !== process.env.SUPER_ADMIN_PASSWORD) {
    await recordAttempt(ip);
    // Brute force'u yavaşlat
    await new Promise((r) => setTimeout(r, 1000));
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

export async function DELETE(request: NextRequest) {
  // CSRF: only allow same-origin requests
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && !origin.endsWith(host)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("sa_verified");
  return response;
}
