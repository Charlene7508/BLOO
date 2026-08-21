import { parseNumber } from "./normalize";
import { NUMBER_SOURCE } from "./units";

export interface ParsedRange {
  low?: number;
  high?: number;
  /** Position du texte de la plage dans la ligne, pour découper le libellé. */
  index: number;
  length: number;
}

/** « (3,96-5,12) », « 3,96 - 5,12 », « 3 200 000 à 5 400 000 » */
const TWO_SIDED = new RegExp(`\\(?\\s*(${NUMBER_SOURCE})\\s*(?:-|à|a)\\s*(${NUMBER_SOURCE})\\s*\\)?`);
/** « < 5 », « Inf. à 600 », « inf à 55 » */
const UPPER_ONLY = new RegExp(`\\(?\\s*(?:<|≤|inf(?:erieur)?\\.?,?\\s*(?:à|a)?)\\s*(${NUMBER_SOURCE})\\s*\\)?`, "i");
/** « > 0,50 », « sup à 40 » */
const LOWER_ONLY = new RegExp(`\\(?\\s*(?:>|≥|sup(?:erieur)?\\.?,?\\s*(?:à|a)?)\\s*(${NUMBER_SOURCE})\\s*\\)?`, "i");

/**
 * Repère l'intervalle de référence imprimé par le laboratoire.
 * Il prime toujours sur le catalogue de Bloo : les techniques d'analyse,
 * donc les normes, varient d'un laboratoire à l'autre.
 */
export function findReferenceRange(text: string): ParsedRange | null {
  const two = TWO_SIDED.exec(text);
  if (two) {
    const low = parseNumber(two[1]);
    const high = parseNumber(two[2]);
    // Un intervalle va du plus petit au plus grand ; sinon c'est une date
    // ou un identifiant qui ressemble par hasard à une plage.
    if (low !== null && high !== null && low < high) {
      return { low, high, index: two.index, length: two[0].length };
    }
  }
  const upper = UPPER_ONLY.exec(text);
  if (upper) {
    const high = parseNumber(upper[1]);
    if (high !== null) return { high, index: upper.index, length: upper[0].length };
  }
  const lower = LOWER_ONLY.exec(text);
  if (lower) {
    const low = parseNumber(lower[1]);
    if (low !== null) return { low, index: lower.index, length: lower[0].length };
  }
  return null;
}
