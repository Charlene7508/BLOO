import { NextResponse } from "next/server";
import { deleteAnalysis, getAnalysis } from "@/lib/analyses";
import { getSessionKey } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });

  const analysis = getAnalysis(key, (await params).id);
  if (!analysis) return NextResponse.json({ error: "Analyse introuvable." }, { status: 404 });
  return NextResponse.json({ analysis });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });

  const removed = deleteAnalysis(key, (await params).id);
  if (!removed) return NextResponse.json({ error: "Analyse introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
