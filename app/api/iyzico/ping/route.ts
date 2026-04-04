import { NextResponse } from "next/server";
import { testAuth } from "@/lib/iyzico";

export async function GET() {
  const { result, debug } = await testAuth();
  return NextResponse.json({ result, debug });
}
