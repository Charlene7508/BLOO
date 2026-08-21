import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { decrypt, decryptJson, encrypt, encryptJson } from "@/lib/crypto";
import { getDb, UPLOADS_DIR } from "@/lib/db";
import type { Report } from "@/lib/analysis/report";
import type { RawResult } from "@/lib/analysis/status";

export interface AnalysisResultEntry extends RawResult {
  label: string;
}

/** Contenu chiffré d'une analyse : tout le sensible vit ici. */
export interface AnalysisPayload {
  title: string;
  labName?: string;
  source: "texte" | "ocr" | "manuel";
  results: AnalysisResultEntry[];
  report: Report;
  /** Nom du fichier chiffré conservé dans data/uploads, le cas échéant. */
  uploadId?: string;
  originalFileName?: string;
}

export interface StoredAnalysis extends AnalysisPayload {
  id: string;
  createdAt: string;
  sampleDate?: string;
}

export function saveAnalysis(
  key: Buffer,
  payload: AnalysisPayload,
  sampleDate: string | undefined,
): string {
  const id = randomUUID();
  getDb()
    .prepare(
      "INSERT INTO analyses (id, created_at, sample_date, payload, file_name) VALUES (?, ?, ?, ?, ?)",
    )
    .run(
      id,
      new Date().toISOString(),
      sampleDate ?? null,
      encryptJson(key, payload),
      payload.originalFileName ?? null,
    );
  return id;
}

interface AnalysisRow {
  id: string;
  created_at: string;
  sample_date: string | null;
  payload: Buffer;
}

function hydrate(key: Buffer, row: AnalysisRow): StoredAnalysis | null {
  try {
    const payload = decryptJson<AnalysisPayload>(key, row.payload);
    return {
      ...payload,
      id: row.id,
      createdAt: row.created_at,
      sampleDate: row.sample_date ?? undefined,
    };
  } catch {
    // Enregistrement illisible avec cette clé : on l'ignore plutôt que de
    // faire échouer toute la liste.
    return null;
  }
}

export function listAnalyses(key: Buffer): StoredAnalysis[] {
  const rows = getDb()
    .prepare(
      "SELECT id, created_at, sample_date, payload FROM analyses ORDER BY COALESCE(sample_date, created_at) DESC",
    )
    .all() as AnalysisRow[];
  return rows.map((row) => hydrate(key, row)).filter((a): a is StoredAnalysis => a !== null);
}

export function getAnalysis(key: Buffer, id: string): StoredAnalysis | null {
  const row = getDb()
    .prepare("SELECT id, created_at, sample_date, payload FROM analyses WHERE id = ?")
    .get(id) as AnalysisRow | undefined;
  return row ? hydrate(key, row) : null;
}

export function deleteAnalysis(key: Buffer, id: string): boolean {
  const analysis = getAnalysis(key, id);
  if (analysis?.uploadId) {
    fs.rmSync(uploadPath(analysis.uploadId), { force: true });
  }
  return getDb().prepare("DELETE FROM analyses WHERE id = ?").run(id).changes > 0;
}

export function uploadPath(uploadId: string): string {
  // Le nom est un UUID généré côté serveur : rien qui vienne du client.
  return path.join(UPLOADS_DIR, `${uploadId}.enc`);
}

/** Conserve le document d'origine, chiffré au repos comme le reste. */
export function storeUpload(key: Buffer, data: Buffer): string {
  const uploadId = randomUUID();
  fs.writeFileSync(uploadPath(uploadId), encrypt(key, data));
  return uploadId;
}

export function readUpload(key: Buffer, uploadId: string): Buffer | null {
  const file = uploadPath(uploadId);
  if (!fs.existsSync(file)) return null;
  try {
    return decrypt(key, fs.readFileSync(file));
  } catch {
    return null;
  }
}
