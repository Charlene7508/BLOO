import { NextResponse } from "next/server";
import { closeSession } from "@/lib/session";

export async function POST() {
  await closeSession();
  return NextResponse.json({ ok: true });
}
