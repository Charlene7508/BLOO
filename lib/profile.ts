import type { Sex } from "@/lib/markers/types";
import { decryptJson, encryptJson } from "@/lib/crypto";
import { getDb } from "@/lib/db";

/**
 * Profil utilisateur : tout ce qui affine la lecture des résultats.
 * Stocké chiffré, jamais transmis ailleurs que dans cette application.
 */
export interface Profile {
  sex?: Sex;
  birthYear?: number;
  heightCm?: number;
  weightKg?: number;
  pregnant?: boolean;
  smoker?: boolean;
  /** Activité physique : influence CPK, ASAT, créatinine. */
  activity?: "faible" | "moderee" | "intense";
  /** Régime : oriente l'interprétation d'une B12 ou d'une ferritine basse. */
  diet?: "omnivore" | "vegetarien" | "vegetalien";
  treatments?: string;
  conditions?: string;
  notes?: string;
}

export const EMPTY_PROFILE: Profile = {};

export function loadProfile(key: Buffer): Profile {
  const row = getDb().prepare("SELECT payload FROM profile WHERE id = 1").get() as
    | { payload: Buffer }
    | undefined;
  if (!row) return EMPTY_PROFILE;
  try {
    return decryptJson<Profile>(key, row.payload);
  } catch {
    // Coffre illisible avec cette clé : on préfère un profil vide à une erreur.
    return EMPTY_PROFILE;
  }
}

export function saveProfile(key: Buffer, profile: Profile): void {
  getDb()
    .prepare(
      `INSERT INTO profile (id, payload, updated_at) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
    )
    .run(encryptJson(key, profile), new Date().toISOString());
}

/** Âge courant déduit de l'année de naissance. */
export function ageFromProfile(profile: Profile): number | undefined {
  if (!profile.birthYear) return undefined;
  return new Date().getFullYear() - profile.birthYear;
}
