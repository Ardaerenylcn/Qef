import { NextRequest, NextResponse } from "next/server";
import { sendNewUserNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, venueName } = await req.json() as { email: string; fullName: string; venueName: string };
    if (!email) return NextResponse.json({ error: "email gerekli" }, { status: 400 });
    await sendNewUserNotification(email, fullName ?? "", venueName ?? "");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
