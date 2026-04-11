import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialReminder, sendRenewalReminder } from "@/lib/email";

export async function GET(req: NextRequest) {
  // Vercel Cron'dan gelen isteği doğrula
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const results = { trialReminders: 0, renewalReminders: 0, errors: 0 };

  // Trial bitiş hatırlatmaları: 7 gün ve 1 gün kala
  for (const daysLeft of [7, 1]) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + daysLeft);
    const dateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const { data: cafes } = await admin
      .from("cafes")
      .select("id, name, user_id")
      .eq("plan", "free")
      .gte("trial_ends_at", `${dateStr}T00:00:00.000Z`)
      .lt("trial_ends_at", `${dateStr}T23:59:59.999Z`);

    for (const cafe of cafes ?? []) {
      try {
        const { data: userData } = await admin.auth.admin.getUserById(cafe.user_id);
        const email = userData?.user?.email;
        if (email) {
          await sendTrialReminder(email, daysLeft, cafe.name ?? "Kafeniz");
          results.trialReminders++;
        }
      } catch {
        results.errors++;
      }
    }
  }

  // Pro yenileme hatırlatması: 14 gün kala
  const renewalDate = new Date(now);
  renewalDate.setDate(renewalDate.getDate() + 14);
  const renewalDateStr = renewalDate.toISOString().split("T")[0];

  const { data: proCafes } = await admin
    .from("cafes")
    .select("id, name, user_id, pro_ends_at")
    .eq("plan", "pro")
    .gte("pro_ends_at", `${renewalDateStr}T00:00:00.000Z`)
    .lt("pro_ends_at", `${renewalDateStr}T23:59:59.999Z`);

  for (const cafe of proCafes ?? []) {
    try {
      const { data: userData } = await admin.auth.admin.getUserById(cafe.user_id);
      const email = userData?.user?.email;
      if (email) {
        await sendRenewalReminder(email, new Date(cafe.pro_ends_at), cafe.name ?? "Kafeniz");
        results.renewalReminders++;
      }
    } catch {
      results.errors++;
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
