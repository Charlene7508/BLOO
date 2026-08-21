import { NextResponse } from "next/server";
import { z } from "zod";
import { isVaultInitialised } from "@/lib/db";
import { openSession } from "@/lib/session";
import { initialiseVault, MIN_PASSWORD_LENGTH } from "@/lib/vault";

const schema = z.object({
  password: z.string().min(MIN_PASSWORD_LENGTH, `Au moins ${MIN_PASSWORD_LENGTH} caractères.`),
});

export async function POST(request: Request) {
  if (isVaultInitialised()) {
    return NextResponse.json({ error: "Le coffre existe déjà." }, { status: 409 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const dataKey = await initialiseVault(parsed.data.password);
  await openSession(dataKey);
  return NextResponse.json({ ok: true });
}
