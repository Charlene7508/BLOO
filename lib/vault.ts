import {
  decrypt,
  deriveKeyEncryptionKey,
  encrypt,
  generateDataKey,
  generateSalt,
} from "@/lib/crypto";
import { getDb } from "@/lib/db";

/** Longueur minimale du mot de passe maître : il protège des données de santé. */
export const MIN_PASSWORD_LENGTH = 10;

interface VaultRow {
  kdf_salt: Buffer;
  wrapped_dek: Buffer;
}

function readVault(): VaultRow | undefined {
  return getDb().prepare("SELECT kdf_salt, wrapped_dek FROM vault WHERE id = 1").get() as
    | VaultRow
    | undefined;
}

/**
 * Crée le coffre au premier lancement.
 *
 * Le mot de passe n'est jamais stocké, pas même haché : il sert à dériver une
 * clé qui enveloppe la clé de données. Sans lui, les analyses sont
 * définitivement illisibles — il n'existe aucune procédure de récupération.
 */
export async function initialiseVault(password: string): Promise<Buffer> {
  if (readVault()) throw new Error("Le coffre est déjà initialisé");

  const salt = generateSalt();
  const kek = await deriveKeyEncryptionKey(password, salt);
  const dataKey = generateDataKey();

  getDb()
    .prepare("INSERT INTO vault (id, kdf_salt, wrapped_dek, created_at) VALUES (1, ?, ?, ?)")
    .run(salt, encrypt(kek, dataKey), new Date().toISOString());

  return dataKey;
}

/**
 * Déverrouille le coffre. Renvoie null si le mot de passe est faux : c'est
 * l'authentification GCM qui le détecte, aucune comparaison de mot de passe
 * n'a lieu.
 */
export async function unlockVault(password: string): Promise<Buffer | null> {
  const vault = readVault();
  if (!vault) return null;

  const kek = await deriveKeyEncryptionKey(password, vault.kdf_salt);
  try {
    return decrypt(kek, vault.wrapped_dek);
  } catch {
    return null;
  }
}
