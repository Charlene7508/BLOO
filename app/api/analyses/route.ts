import { NextResponse } from "next/server";
import { z } from "zod";
import { buildReport } from "@/lib/analysis/report";
import { evaluateAll } from "@/lib/analysis/status";
import { listAnalyses, saveAnalysis } from "@/lib/analyses";
import { MARKERS_BY_KEY } from "@/lib/markers/catalog";
import { loadProfile } from "@/lib/profile";
import { getSessionKey } from "@/lib/session";

const resultSchema = z.object({
  /** `null` pour une mesure que le catalogue de Bloo ne couvre pas encore. */
  markerKey: z.string().min(1).nullable(),
  /** Obligatoire hors catalogue : c'est la seule identité de la mesure. */
  label: z.string().trim().min(1).max(120).optional(),
  value: z.number().finite(),
  unit: z.string().default(""),
  refLow: z.number().finite().optional(),
  refHigh: z.number().finite().optional(),
});

const schema = z.object({
  title: z.string().trim().min(1).max(120),
  sampleDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  labName: z.string().max(120).optional(),
  source: z.enum(["texte", "ocr", "manuel"]),
  uploadId: z.string().uuid().optional(),
  originalFileName: z.string().max(200).optional(),
  results: z.array(resultSchema).min(1, "Ajoute au moins un résultat."),
});

export async function GET() {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });
  return NextResponse.json({ analyses: listAnalyses(key) });
}

export async function POST(request: Request) {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const input = parsed.data;

  // Les clés de marqueur inconnues sont écartées, mais les mesures non
  // répertoriées sont conservées : Bloo sait les situer par rapport à la norme
  // du laboratoire, et les faire disparaître donnerait une lecture tronquée
  // sans que l'utilisateur le sache.
  const entries = input.results
    .filter((r) => r.markerKey === null || MARKERS_BY_KEY[r.markerKey] !== undefined)
    .map((r) => ({
      ...r,
      label: r.markerKey
        ? MARKERS_BY_KEY[r.markerKey].label
        : (r.label ?? "Marqueur non identifié"),
    }));

  if (!entries.length) {
    return NextResponse.json({ error: "Aucun résultat à enregistrer." }, { status: 400 });
  }

  // Le sexe du profil affine les normes de repli (hémoglobine, ferritine, créatinine...).
  const profile = loadProfile(key);
  const evaluated = evaluateAll(entries, profile.sex);
  const report = buildReport(evaluated);

  const id = saveAnalysis(
    key,
    {
      title: input.title,
      labName: input.labName,
      source: input.source,
      uploadId: input.uploadId,
      originalFileName: input.originalFileName,
      results: entries,
      report,
    },
    input.sampleDate,
  );

  return NextResponse.json({ id });
}
