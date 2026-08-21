import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import { unifyDashes, unifyMicro } from "./normalize";
import { rowsFromItems, type PdfRow, type TextItem } from "./pdf";

/** Les scans sont rendus à 2x : en dessous, l'OCR perd les petits caractères. */
const RENDER_SCALE = 2;
/** Tolérance de regroupement en lignes, en pixels de l'image rendue. */
const OCR_ROW_TOLERANCE = 9;

export interface OcrProgress {
  page: number;
  totalPages: number;
}

/**
 * Reconnaissance de texte sur un PDF scanné (photo ou fax de compte rendu).
 *
 * Tesseract tourne en WebAssembly dans le processus Node et le modèle de
 * langue est embarqué dans le dépôt : aucun appel réseau, aucune donnée de
 * santé transmise à un tiers, et rien à payer.
 */
export async function ocrPdfPages(
  data: Uint8Array,
  onProgress?: (p: OcrProgress) => void,
): Promise<PdfRow[]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createWorker } = await import("tesseract.js");

  // Copie défensive : pdfjs détache le tableau qu'on lui passe.
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data), useSystemFonts: true }).promise;
  const worker = await createWorker("fra", 1, {
    langPath: path.join(process.cwd(), "vendor", "tessdata"),
    gzip: true,
    cacheMethod: "none",
    logger: () => {},
  });

  const rows: PdfRow[] = [];
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      onProgress?.({ page: p, totalPages: doc.numPages });

      const page = await doc.getPage(p);
      const viewport = page.getViewport({ scale: RENDER_SCALE });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");
      // Fond blanc : un scan transparent ressortirait noir sur noir.
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, viewport.width, viewport.height);
      await page.render({
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport,
        canvas: canvas as unknown as HTMLCanvasElement,
      }).promise;

      const { data: result } = await worker.recognize(
        canvas.toBuffer("image/png"),
        {},
        { blocks: true },
      );

      const items: TextItem[] = [];
      for (const block of result.blocks ?? []) {
        for (const paragraph of block.paragraphs ?? []) {
          for (const line of paragraph.lines ?? []) {
            for (const word of line.words ?? []) {
              const text = word.text?.trim();
              if (!text) continue;
              items.push({
                text: unifyDashes(unifyMicro(text)),
                x: word.bbox.x0,
                // L'image compte les y vers le bas, le PDF vers le haut :
                // on inverse pour garder une seule convention en aval.
                y: -word.bbox.y0,
              });
            }
          }
        }
      }
      rows.push(...rowsFromItems(items, p, OCR_ROW_TOLERANCE));
    }
  } finally {
    await worker.terminate();
  }

  return rows;
}
