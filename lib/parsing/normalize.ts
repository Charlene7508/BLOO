/** Uniformise les deux « micro » qui circulent dans les PDF de laboratoire. */
export function unifyMicro(s: string): string {
  return s.replace(/[µμ]/g, "µ");
}

/**
 * Uniformise les tirets : les comptes rendus utilisent volontiers le signe
 * moins U+2212 ou un tiret cadratin là où on attend un trait d'union.
 */
export function unifyDashes(s: string): string {
  return s.replace(/[‐-―−]/g, "-");
}

/** minuscules, sans accent, ponctuation réduite à des espaces. */
export function normalize(s: string): string {
  return unifyMicro(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Même chose, mais sans aucun séparateur : « V.G.M. » et « VGM » se rejoignent. */
export function compact(s: string): string {
  return normalize(s).replace(/ /g, "");
}

/**
 * « 12,5 » et « 12.5 » désignent le même nombre.
 * Les laboratoires écrivent aussi les grands nombres avec des séparateurs de
 * milliers — « 4 170 000 /mm3 », parfois « 11.000 ». En français la virgule
 * est le séparateur décimal, donc un point suivi d'exactement trois chiffres
 * est un séparateur de milliers, pas une décimale.
 */
export function parseNumber(raw: string): number | null {
  let cleaned = raw.replace(/[\s\u00a0\u202f]/g, "");
  if (/^\d{1,3}(?:\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, "");
  const n = Number(cleaned.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
