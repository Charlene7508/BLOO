import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/** Emplacement des données, hors du dépôt et ignoré par git. */
export const DATA_DIR = process.env.BLOO_DATA_DIR ?? path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

let instance: Database.Database | null = null;

/**
 * Base locale unique.
 *
 * Rien de sensible n'est en clair : le profil, les résultats et les comptes
 * rendus sont stockés chiffrés (AES-256-GCM) dans des colonnes BLOB. Seuls
 * les identifiants et les dates restent lisibles, pour pouvoir trier.
 */
export function getDb(): Database.Database {
  if (instance) return instance;

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const db = new Database(path.join(DATA_DIR, "bloo.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS vault (
      id           INTEGER PRIMARY KEY CHECK (id = 1),
      kdf_salt     BLOB NOT NULL,
      wrapped_dek  BLOB NOT NULL,
      created_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profile (
      id         INTEGER PRIMARY KEY CHECK (id = 1),
      payload    BLOB NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id          TEXT PRIMARY KEY,
      created_at  TEXT NOT NULL,
      sample_date TEXT,
      payload     BLOB NOT NULL,
      file_name   TEXT
    );

    CREATE INDEX IF NOT EXISTS analyses_sample_date ON analyses (sample_date DESC, created_at DESC);
  `);

  instance = db;
  return db;
}

/** Vrai dès que le coffre a été initialisé par un mot de passe maître. */
export function isVaultInitialised(): boolean {
  const row = getDb().prepare("SELECT 1 FROM vault WHERE id = 1").get();
  return row !== undefined;
}
