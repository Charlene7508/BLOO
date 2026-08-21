/**
 * Unités rencontrées sur les comptes rendus français. L'ordre importe :
 * la recherche teste les plus longues d'abord, pour que « mL/min/1,73m2 »
 * ne soit pas tronqué en « mL ».
 */
export const KNOWN_UNITS = [
  "mL/min/1,73m2",
  "mL/min/1.73m2",
  "mL/min/1,73m²",
  "mL/min",
  "g/24h",
  "mg/24h",
  "mmol/24h",
  "µmol/L",
  "mmol/L",
  "nmol/L",
  "pmol/L",
  "µkat/L",
  "mUI/mL",
  "mUI/L",
  "UI/mL",
  "UI/L",
  "U/L",
  "mEq/L",
  "ng/mL",
  "pg/mL",
  "µg/dL",
  "µg/mL",
  "µg/L",
  "mg/dL",
  "mg/L",
  "g/dL",
  "ng/L",
  "g/L",
  "T/L",
  "G/L",
  "M/L",
  "10^12/L",
  "10^9/L",
  "10*12/L",
  "10*9/L",
  "/mm3",
  "mm3",
  "µ3",
  "picog",
  "mm/h",
  "fL",
  "pg",
  "mm",
  "%",
] as const;

const escaped = KNOWN_UNITS.map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .sort((a, b) => b.length - a.length)
  .join("|");

/** Un nombre, avec ou sans séparateurs de milliers : « 4 170 000 », « 12,5 ». */
// Au plus trois groupes de milliers : au-delà, ce n'est plus un résultat
// d'analyse mais deux colonnes que la mise en page a collées.
export const NUMBER_SOURCE = "\\d{1,3}(?:[ \\u00a0\\u202f]\\d{3}){1,3}|\\d+(?:[.,]\\d+)?";

/** Un nombre suivi, éventuellement, d'une unité connue. */
// L'unité ne doit pas être suivie d'une lettre : sinon « mmoy/L », mal lu par
// l'OCR, se ferait passer pour l'unité « mm ».
export const VALUE_WITH_UNIT = new RegExp(
  `(${NUMBER_SOURCE})\\s*(?:(${escaped})(?![A-Za-zÀ-ÿ]))?`,
  "gi",
);

/** Une unité connue, isolée. */
export const UNIT_ONLY = new RegExp(`^(?:${escaped})$`, "i");

/**
 * Rend à l'unité sa casse canonique (« ui/l » -> « UI/L »).
 * La correspondance exacte passe en premier : « G/L » (giga par litre) et
 * « g/L » (grammes par litre) ne diffèrent que par la casse et désignent
 * des grandeurs sans rapport.
 */
export function canonicalUnit(raw: string): string {
  const exact = KNOWN_UNITS.find((u) => u === raw);
  if (exact) return exact;
  const loose = KNOWN_UNITS.find((u) => u.toLowerCase() === raw.toLowerCase());
  return loose ?? raw;
}
