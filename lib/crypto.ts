import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";
import { promisify } from "node:util";

// promisify retient la surcharge à trois arguments : on réexpose celle qui
// accepte les paramètres de coût.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

/** Paramètres scrypt : coût volontairement élevé, on ne dérive qu'au déverrouillage. */
const SCRYPT = { N: 2 ** 16, r: 8, p: 1, maxmem: 128 * 2 ** 16 * 8 * 2 };
const KEY_BYTES = 32;
const IV_BYTES = 12;
const TAG_BYTES = 16;

/**
 * Dérive la clé de chiffrement du coffre à partir du mot de passe maître.
 * Cette clé ne sert qu'à envelopper la vraie clé de données : changer de mot
 * de passe ne demandera donc pas de rechiffrer toutes les analyses.
 */
export async function deriveKeyEncryptionKey(password: string, salt: Buffer): Promise<Buffer> {
  return (await scryptAsync(password.normalize("NFKC"), salt, KEY_BYTES, SCRYPT)) as Buffer;
}

export function generateSalt(): Buffer {
  return randomBytes(16);
}

/** Clé de données : c'est elle qui chiffre réellement analyses et profil. */
export function generateDataKey(): Buffer {
  return randomBytes(KEY_BYTES);
}

/** AES-256-GCM. Le format de sortie est iv | tag | chiffré. */
export function encrypt(key: Buffer, plaintext: Buffer | string): Buffer {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = typeof plaintext === "string" ? Buffer.from(plaintext, "utf8") : plaintext;
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
}

/**
 * Déchiffre un bloc produit par `encrypt`.
 * Lève si l'authentification GCM échoue : mot de passe faux ou données altérées.
 */
export function decrypt(key: Buffer, blob: Buffer): Buffer {
  if (blob.length < IV_BYTES + TAG_BYTES) throw new Error("Bloc chiffré trop court");
  const iv = blob.subarray(0, IV_BYTES);
  const tag = blob.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(blob.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]);
}

export function encryptJson(key: Buffer, value: unknown): Buffer {
  return encrypt(key, JSON.stringify(value));
}

export function decryptJson<T>(key: Buffer, blob: Buffer): T {
  return JSON.parse(decrypt(key, blob).toString("utf8")) as T;
}

/** Comparaison à durée constante, pour ne rien laisser fuir par le temps de réponse. */
export function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}
