import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug gerekli" }, { status: 400 });

  revalidatePath(`/menu/${slug}`);
  return NextResponse.json({ revalidated: true });
}
