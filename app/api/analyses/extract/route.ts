import { NextResponse } from "next/server";
import { storeUpload } from "@/lib/analyses";
import { extractFromPdf } from "@/lib/parsing/extract";
import { getSessionKey } from "@/lib/session";

/** L'OCR d'un scan de plusieurs pages demande du temps ; on laisse la marge. */
export const maxDuration = 300;

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request) {
  const key = await getSessionKey();
  if (!key) return NextResponse.json({ error: "Coffre verrouillé." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("fichier");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (25 Mo maximum)." }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  // Signature %PDF- : on ne tente pas de lire autre chose qu'un PDF.
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json(
      { error: "Bloo ne lit que les PDF pour l'instant. Tu peux aussi saisir tes résultats à la main." },
      { status: 415 },
    );
  }

  try {
    const outcome = await extractFromPdf(new Uint8Array(bytes));
    // Le document d'origine est conservé chiffré, pour pouvoir le relire.
    const uploadId = storeUpload(key, bytes);

    return NextResponse.json({
      uploadId,
      originalFileName: file.name,
      source: outcome.source,
      detectedSex: outcome.detectedSex,
      detectedAge: outcome.detectedAge,
      sampleDate: outcome.sampleDate,
      labName: outcome.labName,
      results: outcome.results,
    });
  } catch (error) {
    console.error("Échec de lecture du PDF", error);
    return NextResponse.json(
      { error: "Bloo n'a pas réussi à lire ce document. Tu peux saisir tes résultats à la main." },
      { status: 422 },
    );
  }
}
