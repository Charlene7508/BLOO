import { NextResponse } from "next/server";
import { isVaultInitialised } from "@/lib/db";
import { getSessionKey } from "@/lib/session";

export async function GET() {
  return NextResponse.json({
    initialised: isVaultInitialised(),
    unlocked: (await getSessionKey()) !== null,
  });
}
