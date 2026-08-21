import { NextResponse } from "next/server";
import { z } from "zod";
import { loadProfile, saveProfile } from "@/lib/profile";
import { getSessionKey } from "@/lib/session";

const schema = z.object({
  sex: z.enum(["F", "M"]).optional(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  heightCm: z.number().int().min(50).max(250).optional(),
  weightKg: z.number().min(20).max(400).optional(),
  pregnant: z.boolean().optional(),
  smoker: z.boolean().optional(),
  activity: z.enum(["faible", "moderee", "intense"]).optional(),
  diet: z.enum(["omnivore", "vegetarien", "vegetalien"]).optional(),
  treatments: z.string().max(2000).optional(),
  conditions: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET() {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });
  return NextResponse.json({ profile: loadProfile(key) });
}

export async function PUT(request: Request) {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  saveProfile(key, parsed.data);
  return NextResponse.json({ ok: true });
}
