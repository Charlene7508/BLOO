import { MARKERS_BY_KEY } from "@/lib/markers/catalog";
import type { CatalogRange, Sex } from "@/lib/markers/types";
import { unifyMicro } from "@/lib/parsing/normalize";

export type MarkerStatus = "bas" | "normal" | "haut" | "inconnu";

export interface EvaluatedResult {
  /** `null` pour un marqueur absent du catalogue. */
  markerKey: string | null;
  label: string;
  value: number;
  unit: string;
  low?: number;
  high?: number;
  status: MarkerStatus;
  /** « nettement » quand l'écart dépasse 20 % de la borne franchie. */
  marked: boolean;
  rangeSource: "laboratoire" | "catalogue" | "aucune";
  category: string;
}

/** Une mesure, telle qu'elle arrive du parseur ou de la saisie manuelle. */
export interface RawResult {
  /** `null` quand le laboratoire mesure un marqueur que Bloo ne connaît pas. */
  markerKey: string | null;
  /** Libellé du laboratoire, seule identité disponible hors catalogue. */
  label?: string;
  value: number;
  unit: string;
  refLow?: number;
  refHigh?: number;
}

/** « mL/min/1,73m² » et « mL/min/1,73m2 » désignent la même unité. */
function unitKey(u: string): string {
  return unifyMicro(u).replace(/²/g, "2").replace(/\s/g, "").toLowerCase();
}

function sameUnit(a: string, b: string): boolean {
  return a === b || unitKey(a) === unitKey(b);
}

/**
 * Choisit la plage de référence applicable.
 * Celle imprimée par le laboratoire l'emporte toujours : les normes dépendent
 * de la technique d'analyse, qui varie d'un laboratoire à l'autre.
 */
function findCatalogRange(
  markerKey: string | null,
  unit: string,
  sex: Sex | undefined,
): { low?: number; high?: number } | null {
  const marker = markerKey ? MARKERS_BY_KEY[markerKey] : undefined;
  if (!marker) return null;

  const candidates = marker.ranges.filter((r: CatalogRange) => sameUnit(r.unit, unit));
  if (!candidates.length) return null;

  const forSex = sex ? candidates.find((r) => r.sex === sex) : undefined;
  if (forSex) return { low: forSex.low, high: forSex.high };

  const neutral = candidates.find((r) => r.sex === undefined);
  if (neutral) return { low: neutral.low, high: neutral.high };

  // Il existe des plages, mais uniquement pour l'autre sexe : c'est le cas des
  // hormones, dont les valeurs féminines dépendent du moment du cycle. Appliquer
  // la plage masculine à une femme fabriquerait une alerte de toutes pièces —
  // mieux vaut ne rien affirmer et s'en remettre à la norme du laboratoire.
  return null;
}

/**
 * Deux plages séparées d'un facteur dix ne décrivent pas la même grandeur.
 *
 * Sur un document scanné, l'OCR perd volontiers les virgules décimales : la
 * plage « 5,1 à 8,5 » ressort en « 51 à 85 ». Sans ce garde-fou, un résultat
 * parfaitement normal serait signalé comme anormal.
 */
const RANGE_DISCREPANCY_FACTOR = 5;

function farApart(a: number | undefined, b: number | undefined): boolean {
  if (a === undefined || b === undefined || a <= 0 || b <= 0) return false;
  const ratio = a / b;
  return ratio >= RANGE_DISCREPANCY_FACTOR || ratio <= 1 / RANGE_DISCREPANCY_FACTOR;
}

/**
 * Choisit la plage de référence applicable.
 * Celle imprimée par le laboratoire l'emporte — les normes dépendent de la
 * technique d'analyse — sauf quand elle est manifestement mal lue.
 */
function pickRange(
  raw: RawResult,
  sex: Sex | undefined,
): { low?: number; high?: number; source: EvaluatedResult["rangeSource"] } {
  const catalogRange = findCatalogRange(raw.markerKey, raw.unit, sex);

  if (raw.refLow !== undefined || raw.refHigh !== undefined) {
    const printed = { low: raw.refLow, high: raw.refHigh };
    const misread =
      catalogRange !== null &&
      (farApart(printed.low, catalogRange.low) || farApart(printed.high, catalogRange.high));
    if (!misread) return { ...printed, source: "laboratoire" };
    return { ...catalogRange, source: "catalogue" };
  }

  return catalogRange ? { ...catalogRange, source: "catalogue" } : { source: "aucune" };
}

/** Écart significatif : plus de 20 % au-delà de la borne franchie. */
function isMarked(value: number, low: number | undefined, high: number | undefined): boolean {
  if (high !== undefined && value > high && high !== 0) return value > high * 1.2;
  if (low !== undefined && value < low && low !== 0) return value < low * 0.8;
  return false;
}

/**
 * Une valeur dix fois hors de la plage du catalogue dénonce une unité mal lue,
 * pas un résultat alarmant : 237 000 plaquettes par mm³ n'ont rien d'anormal,
 * mais comparées à une plage exprimée en G/L elles déclencheraient une alerte
 * absurde. Mieux vaut ne rien affirmer et laisser l'utilisateur corriger.
 */
function isImplausible(value: number, low: number | undefined, high: number | undefined): boolean {
  if (high !== undefined && high > 0 && value > high * 10) return true;
  if (low !== undefined && low > 0 && value < low / 10) return true;
  return false;
}

export function evaluateResult(raw: RawResult, sex: Sex | undefined): EvaluatedResult {
  // Hors catalogue, seule la norme imprimée par le laboratoire permet de
  // situer la valeur — et cela suffit à dire si elle sort de l'intervalle.
  const marker = raw.markerKey ? MARKERS_BY_KEY[raw.markerKey] : undefined;
  const { low, high, source } = pickRange(raw, sex);

  let status: MarkerStatus = "inconnu";
  if (low !== undefined || high !== undefined) {
    if (source === "catalogue" && isImplausible(raw.value, low, high)) status = "inconnu";
    else if (high !== undefined && raw.value > high) status = "haut";
    else if (low !== undefined && raw.value < low) status = "bas";
    else status = "normal";
  }

  return {
    markerKey: raw.markerKey,
    label: marker?.label ?? raw.label ?? "Marqueur non identifié",
    value: raw.value,
    unit: raw.unit,
    low,
    high,
    status,
    marked: status !== "normal" && status !== "inconnu" && isMarked(raw.value, low, high),
    rangeSource: source,
    category: marker?.category ?? "autres",
  };
}

export function evaluateAll(raws: RawResult[], sex: Sex | undefined): EvaluatedResult[] {
  return raws.map((r) => evaluateResult(r, sex));
}
