import { MARKERS } from "@/lib/markers/catalog";
import type { Marker } from "@/lib/markers/types";
import { compact, normalize } from "./normalize";

interface AliasEntry {
  marker: Marker;
  normalized: string;
  compacted: string;
  /** Les abréviations très courtes ne matchent que sur un libellé identique. */
  strict: boolean;
}

const ALIASES: AliasEntry[] = MARKERS.flatMap((marker) =>
  [marker.label, ...marker.aliases].map((alias) => {
    const normalized = normalize(alias);
    return {
      marker,
      normalized,
      compacted: compact(alias),
      strict: normalized.replace(/ /g, "").length <= 2,
    };
  }),
).sort((a, b) => b.normalized.length - a.normalized.length);

/** En dessous de cette longueur, une coquille rendrait deux marqueurs indiscernables
 *  (« alat » et « asat » ne diffèrent que d'une lettre). */
const MIN_FUZZY_LENGTH = 6;
/** Nombre de corrections tolérées sur un libellé issu de l'OCR. */
const MAX_FUZZY_DISTANCE = 2;
/**
 * Écart de longueur toléré. L'OCR confond des lettres (« sodium » lu
 * « socium ») bien plus qu'il n'en ajoute : exiger une longueur quasi
 * identique élimine les rapprochements abusifs entre un mot et un autre plus
 * long, comme « gamma » et « gammagt ».
 */
const MAX_FUZZY_LENGTH_GAP = 1;

export interface MatchOptions {
  /** Tolérer les coquilles : à n'activer que sur du texte issu de l'OCR. */
  fuzzy?: boolean;
}

/**
 * Associe un libellé de ligne à un marqueur du catalogue.
 *
 * Trois passes, de la plus sûre à la plus permissive : correspondance exacte,
 * puis recomposition des libellés ponctués, puis — sur du texte OCR seulement —
 * tolérance aux coquilles.
 */
export function matchMarker(rawLabel: string, options: MatchOptions = {}): Marker | null {
  const label = normalize(rawLabel);
  if (!label) return null;

  const tokens = label.split(" ").filter(Boolean);
  const labelCompact = tokens.join("");

  // 1. Correspondance exacte. L'alias le plus long gagne, pour que
  //    « fer sérique » l'emporte sur « fer ».
  for (const entry of ALIASES) {
    if (entry.strict) {
      if (labelCompact === entry.compacted) return entry.marker;
      continue;
    }
    const boundary = new RegExp(`(?:^| )${escapeRegExp(entry.normalized)}(?:$| )`);
    if (boundary.test(label)) return entry.marker;
  }

  // 2. Libellés ponctués : « V.P.M. » et « T.S.H. » se découpent en lettres
  //    isolées, qu'il faut recoller — y compris quand des points de conduite
  //    illisibles suivent sur la même ligne.
  for (const entry of ALIASES) {
    if (entry.compacted.length < 3) continue;
    if (hasCompactWindow(tokens, entry.compacted)) return entry.marker;
  }

  // 3. OCR : « SOCIUM » pour Sodium, « ChIOFE » pour Chlore.
  return options.fuzzy ? fuzzyMatch(tokens) : null;
}

/** Cherche une suite de mots consécutifs qui, recollés, forment l'alias. */
function hasCompactWindow(tokens: string[], target: string): boolean {
  for (let start = 0; start < tokens.length; start++) {
    let joined = tokens[start];
    // Une fenêtre d'un seul mot a déjà été traitée par la correspondance exacte.
    for (let end = start + 1; end < tokens.length && joined.length < target.length; end++) {
      joined += tokens[end];
      if (joined === target) return true;
    }
  }
  return false;
}

/**
 * Correspondance tolérante aux coquilles de reconnaissance optique.
 * En cas d'égalité entre deux marqueurs, on préfère ne rien reconnaître :
 * une valeur attribuée au mauvais marqueur est pire qu'une valeur manquante.
 */
function fuzzyMatch(tokens: string[]): Marker | null {
  let best: Marker | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let ambiguous = false;

  for (const entry of ALIASES) {
    const alias = entry.normalized;
    if (alias.length < MIN_FUZZY_LENGTH) continue;

    const wordCount = alias.split(" ").length;
    // Le nom du marqueur ouvre la ligne : inutile de chercher au-delà des
    // premiers mots, ce serait autant de faux positifs en plus.
    for (let start = 0; start + wordCount <= tokens.length && start < 3; start++) {
      const window = tokens.slice(start, start + wordCount).join(" ");
      if (Math.abs(window.length - alias.length) > MAX_FUZZY_LENGTH_GAP) continue;

      const distance = levenshtein(window, alias);
      if (distance > MAX_FUZZY_DISTANCE) continue;

      if (distance < bestDistance) {
        bestDistance = distance;
        best = entry.marker;
        ambiguous = false;
      } else if (distance === bestDistance && entry.marker !== best) {
        ambiguous = true;
      }
    }
  }

  return ambiguous ? null : best;
}

function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
