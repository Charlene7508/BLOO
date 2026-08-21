import { unifyDashes, unifyMicro } from "./normalize";

export interface TextItem {
  text: string;
  x: number;
  y: number;
}

export interface PdfRow {
  page: number;
  y: number;
  items: TextItem[];
  /** Ligne reconstituée, items ordonnés de gauche à droite. */
  text: string;
}

export interface PdfDocumentText {
  rows: PdfRow[];
  /** Vrai si le PDF ne contient aucune couche texte exploitable (scan ou photo). */
  isScanned: boolean;
}

/** Tolérance verticale : le libellé, la valeur et la plage d'une même ligne
 *  ne partagent pas exactement la même ligne de base. */
const ROW_TOLERANCE = 3.5;

/**
 * Regroupe des fragments de texte positionnés en lignes visuelles.
 * Partagé par les deux sources : couche texte du PDF et OCR d'un scan.
 */
export function rowsFromItems(items: TextItem[], page: number, tolerance = ROW_TOLERANCE): PdfRow[] {
  const rows: PdfRow[] = [];
  const sorted = [...items].sort((a, b) => b.y - a.y);
  let current: TextItem[] = [];
  let anchor = Number.NaN;

  const flush = () => {
    if (!current.length) return;
    const ordered = [...current].sort((a, b) => a.x - b.x);
    rows.push({
      page,
      y: anchor,
      items: ordered,
      text: ordered.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim(),
    });
    current = [];
  };

  for (const item of sorted) {
    if (Number.isNaN(anchor) || Math.abs(item.y - anchor) > tolerance) {
      flush();
      anchor = item.y;
    }
    current.push(item);
  }
  flush();
  return rows;
}

/**
 * Extrait le texte d'un PDF en conservant les positions, seule façon de
 * distinguer la colonne « résultat » de la colonne « antériorités ».
 * Tout se passe en local : le fichier ne quitte jamais la machine.
 */
export async function extractPdfText(data: Uint8Array): Promise<PdfDocumentText> {
  // Import différé : pdfjs est lourd et n'est utile qu'au moment d'un dépôt.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // pdfjs s'approprie le tableau fourni et le détache : on lui donne une
  // copie, pour que l'appelant puisse relire les mêmes octets ensuite (OCR).
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data), useSystemFonts: true }).promise;

  const rows: PdfRow[] = [];
  let charCount = 0;

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items: TextItem[] = [];

    for (const raw of content.items) {
      const item = raw as { str?: string; transform?: number[] };
      const text = item.str?.trim();
      if (!text || !item.transform) continue;
      items.push({
        text: unifyDashes(unifyMicro(text)),
        x: item.transform[4],
        y: item.transform[5],
      });
      charCount += text.length;
    }

    rows.push(...rowsFromItems(items, p));
  }

  return { rows, isScanned: charCount < 200 };
}
