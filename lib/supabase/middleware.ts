import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /admin rotaları — giriş yapılmamışsa login'e yönlendir
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // /superadmin — sadece platform sahibine açık
  if (request.nextUrl.pathname.startsWith("/superadmin") &&
      !request.nextUrl.pathname.startsWith("/superadmin/login")) {

    // 1. Supabase oturumu + doğru email
    if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // 2. Session token cookie'si (şifre değil HMAC token)
    const saVerified = request.cookies.get("sa_verified")?.value;
    const expectedToken = await generateSessionToken(process.env.SUPER_ADMIN_PASSWORD!);
    if (!saVerified || saVerified !== expectedToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/superadmin/login";
      return NextResponse.redirect(url);
    }
  }

  // Giriş yapmış kullanıcı login/register'a girmeye çalışırsa admin'e yönlendir
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register") &&
    user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
