import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bloo_session";
/** Verrouillage automatique : au-delà, il faut ressaisir le mot de passe maître. */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

interface SessionEntry {
  dataKey: Buffer;
  expiresAt: number;
}

/**
 * Les clés vivent en mémoire du serveur, jamais sur disque ni dans le cookie :
 * fermer l'application suffit à reverrouiller le coffre. Le cache est accroché
 * à globalThis pour survivre au rechargement à chaud en développement.
 */
const store: Map<string, SessionEntry> =
  (globalThis as { __blooSessions?: Map<string, SessionEntry> }).__blooSessions ??
  ((globalThis as { __blooSessions?: Map<string, SessionEntry> }).__blooSessions = new Map());

function purgeExpired(now: number): void {
  for (const [id, entry] of store) {
    if (entry.expiresAt <= now) store.delete(id);
  }
}

export async function openSession(dataKey: Buffer): Promise<void> {
  const now = Date.now();
  purgeExpired(now);
  const id = randomBytes(32).toString("base64url");
  store.set(id, { dataKey, expiresAt: now + IDLE_TIMEOUT_MS });

  const jar = await cookies();
  jar.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: IDLE_TIMEOUT_MS / 1000,
  });
}

/**
 * Renvoie la clé de données de la session en cours, ou null si le coffre est
 * verrouillé. Chaque accès repousse l'échéance d'inactivité.
 */
export async function getSessionKey(): Promise<Buffer | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (!id) return null;

  const now = Date.now();
  purgeExpired(now);
  const entry = store.get(id);
  if (!entry) return null;

  entry.expiresAt = now + IDLE_TIMEOUT_MS;
  return entry.dataKey;
}

export async function closeSession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (id) store.delete(id);
  jar.delete(COOKIE_NAME);
}
