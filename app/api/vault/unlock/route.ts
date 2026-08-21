import { NextResponse } from "next/server";
import { z } from "zod";
import { openSession } from "@/lib/session";
import { unlockVault } from "@/lib/vault";

const schema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Mot de passe manquant." }, { status: 400 });
  }

  const dataKey = await unlockVault(parsed.data.password);
  if (!dataKey) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  await openSession(dataKey);
  return NextResponse.json({ ok: true });
}
