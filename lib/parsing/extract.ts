import { MARKERS_BY_KEY } from "@/lib/markers/catalog";
import type { Sex } from "@/lib/markers/types";
import { matchMarker } from "./matchMarker";
import type { Marker } from "@/lib/markers/types";
import { normalize, parseNumber } from "./normalize";
import { ocrPdfPages, type OcrProgress } from "./ocr";
import { extractPdfText, type PdfRow } from "./pdf";
import { findReferenceRange } from "./refrange";
import { canonicalUnit, VALUE_WITH_UNIT } from "./units";

export interface ExtractedResult {
  /** `null` quand le marqueur n'est pas au catalogue : la mesure est conservée
   *  malgré tout, Bloo saura la situer par rapport à la norme du laboratoire
   *  même s'il ne sait pas encore l'expliquer. */
  markerKey: string | null;
  label: string;
  /** Libellé tel qu'imprimé par le laboratoire, gardé pour vérification. */
  rawLabel: string;
  value: number;
  unit: string;
  /** Vrai si l'unité vient du catalogue faute d'avoir été lue de façon fiable. */
  unitGuessed: boolean;
  /** Intervalle imprimé par le laboratoire, prioritaire sur le catalogue. */
  refLow?: number;
  refHigh?: number;
  refSource: "laboratoire" | "aucune";
  page: number;
}

export interface ExtractionOutcome {
  results: ExtractedResult[];
  /** D'où viennent les données : couche texte du PDF ou reconnaissance optique. */
  source: "texte" | "ocr";
  /** Pré-remplissage du profil ; ni le nom ni l'adresse ne sont extraits. */
  detectedSex?: Sex;
  detectedAge?: number;
  sampleDate?: string;
  labName?: string;
  rowsScanned: number;
}

type RowReading =
  | { kind: "result"; result: ExtractedResult }
  /** Un intitulé de section qui nomme un marqueur, sans valeur : la valeur
   *  arrive à la ligne suivante (« Vitesse de sédimentation » / « 1ère heure »). */
  | { kind: "section"; markerKey: string }
  /** Une valeur sans libellé reconnaissable, rattachable à la section en cours. */
  | { kind: "orphan"; value: number; unit?: string; refLow?: number; refHigh?: number; rawLabel: string }
  | { kind: "none" };

/**
 * Position des colonnes de droite, lue sur les en-têtes du compte rendu.
 *
 * C'est la clé d'une lecture fiable : sans elle, la norme du laboratoire et
 * l'ancien résultat se retrouvent mélangés à la valeur du jour dès que la
 * mise en page se resserre.
 */
interface Columns {
  /** Début de la colonne « Valeurs de référence » / « Intervalle de référence ». */
  referenceX: number | null;
  /** Début de la colonne « Antériorités » : d'anciens résultats. */
  historyX: number | null;
}

function findColumns(rows: PdfRow[]): Columns {
  let referenceX: number | null = null;
  let historyX: number | null = null;

  for (const row of rows) {
    // Les en-têtes sont écrits en plusieurs fragments : on recompose la ligne
    // pour les reconnaître, puis on retient l'abscisse du premier fragment.
    const rowText = normalize(row.text);
    if (referenceX === null && /(valeurs?|intervalle) de reference/.test(rowText)) {
      const anchor = row.items.find((i) => /^(valeurs?|intervalle)$/.test(normalize(i.text)));
      if (anchor) referenceX = anchor.x;
    }
    if (historyX === null && /anteriorit/.test(rowText)) {
      const anchor = row.items.find((i) => /anteriorit/.test(normalize(i.text)));
      if (anchor) historyX = anchor.x;
    }
    if (referenceX !== null && historyX !== null) break;
  }
  return { referenceX, historyX };
}

/**
 * Un nombre isolé est une mesure ; un nombre collé à autre chose est un débris.
 *
 * Les lettres écartent les scories d'OCR (« y3 », « 1ère »). La barre oblique
 * écarte deux pièges fréquents : les unités mal lues, où « g/l » ressort en
 * « 9/1 », et les dates du type « 06/02/18 » imprimées dans la colonne des
 * résultats.
 */
function isStandaloneNumber(text: string, start: number, end: number): boolean {
  const before = text[start - 1];
  const after = text[end];
  const isGlued = (c: string | undefined) => Boolean(c && /[A-Za-zÀ-ÿ/]/.test(c));
  return !isGlued(before) && !isGlued(after);
}

/** Une mesure repérée sur une ligne : sa valeur, son unité si elle est lisible. */
interface Candidate {
  value: number;
  unit?: string;
  index: number;
}

/** Comparaison d'unités sensible à la casse : « G/L » et « g/L » sont distinctes. */
function unitKey(unit: string): string {
  return unit.replace(/²/g, "2").replace(/\s/g, "");
}

/**
 * Classe une mesure selon la vraisemblance de son unité pour ce marqueur :
 * 0 unité attendue, 1 unité illisible, 2 unité étrangère au marqueur.
 * C'est ce qui permet, sur « Albumine 61,9 % 42,1 g/L », d'écarter le
 * pourcentage au profit de la valeur absolue.
 */
function unitRank(candidate: Candidate, marker: Marker): number {
  if (!candidate.unit) return 1;
  const expected = new Set([marker.unit, ...marker.ranges.map((r) => r.unit)].map(unitKey));
  return expected.has(unitKey(candidate.unit)) ? 0 : 2;
}

function withinRange(value: number, range: { low?: number; high?: number }): boolean {
  if (range.low !== undefined && value < range.low) return false;
  if (range.high !== undefined && value > range.high) return false;
  return true;
}

/**
 * Choisit la mesure du jour parmi plusieurs nombres d'une même ligne.
 *
 * Les comptes rendus expriment souvent un même résultat deux fois — en
 * pourcentage puis en valeur absolue. L'intervalle imprimé par le laboratoire
 * désigne sans ambiguïté celle qu'il accompagne ; à défaut, l'unité tranche.
 */
function chooseCandidate(
  candidates: Candidate[],
  marker: Marker,
  range: { low?: number; high?: number } | null,
): Candidate {
  if (candidates.length === 1) return candidates[0];

  if (range && (range.low !== undefined || range.high !== undefined)) {
    const inside = candidates.filter((c) => withinRange(c.value, range));
    if (inside.length) return inside[inside.length - 1];
  }

  const bestRank = Math.min(...candidates.map((c) => unitRank(c, marker)));
  const kept = candidates.filter((c) => unitRank(c, marker) === bestRank);
  return kept[kept.length - 1];
}

function joinItems(items: PdfRow["items"]): string {
  return items.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Noms d'automates et de techniques d'analyse. Les laboratoires les impriment
 * sous chaque marqueur, souvent suivis du même résultat dans une autre unité :
 * ces lignes ne sont pas des marqueurs supplémentaires.
 */
const TECHNIQUE =
  /(architect|abbott|beckman|coulter|sebia|siemens|roche|cobas|capillarys|alifax|hexokinase|ifcc|biuret|friedewald|arsenazo|cmia|latex|enzymatique|immunoturbidim|potentiom|colorim|photom|spectrophotom|cytom|imp[ée]danc|fluoro|turbidim|n[ée]ph[ée]lom|chimiluminescence)/i;

/**
 * Mentions d'en-tête, de pied de page et de notes techniques : elles portent
 * des nombres sans être des résultats d'analyse.
 */
const BOILERPLATE =
  /\b(page|t[ée]l[ée]phone|fax|finess|autorisation|accr[ée]ditation|rpps|siret|matricule|dossier|demande|[ée]dit[ée]|pr[ée]lev|valid[ée]|stade|risque|objectif|formule|selon|compter|modification|changement|nature de l|technique|dosage|m[ée]thode|labo|adresse|code|rue|avenue|capital|si[èe]ge|www|http|interpr[ée]tation|recommandation|r[ée]sultat identique|aspect)\b/i;

/**
 * Une ligne non reconnue est-elle malgré tout un résultat d'analyse ?
 *
 * Le critère décisif est la norme imprimée par le laboratoire : c'est elle qui
 * permet de dire « dans l'intervalle » ou non sans rien connaître du marqueur,
 * et ni un numéro de page ni une note de bas de page n'en possède. On reste
 * volontairement prudent — une ligne parasite affichée coûte plus cher en
 * confiance qu'un marqueur exotique manqué.
 */
function looksLikeResult(rawLabel: string, hasRange: boolean): boolean {
  if (!hasRange) return false;

  const label = rawLabel.trim();
  if (label.length < 3 || label.length > 60) return false;
  // Un vrai libellé de marqueur contient des mots, pas seulement des chiffres.
  if (!/[A-Za-zÀ-ÿ]{3}/.test(label)) return false;
  // Les lignes entre parenthèses nomment la technique d'analyse et réexpriment
  // le résultat de la ligne précédente dans une autre unité.
  if (label.startsWith("(")) return false;
  if (BOILERPLATE.test(label) || TECHNIQUE.test(label)) return false;
  // Un libellé de marqueur ne se termine pas par un mot outil : c'est alors une
  // phrase du compte rendu que la mise en page a coupée.
  if (/ (de|du|des|en|a|au|aux|pour|par|sous|sur|dans|avec|le|la|les|un|une|est|et)$/.test(normalize(label))) {
    return false;
  }

  return true;
}

/** Nettoie le libellé des puces, dièses et points de conduite du compte rendu. */
function cleanLabel(raw: string): string {
  return raw.replace(/[*#.:]+/g, " ").trim();
}

function readRow(row: PdfRow, columns: Columns, margin: number, fuzzy: boolean): RowReading {
  const { referenceX, historyX } = columns;
  const rightEdge = historyX === null ? Number.POSITIVE_INFINITY : historyX - margin;
  const inScope = row.items.filter((i) => i.x < rightEdge);
  if (!inScope.length) return { kind: "none" };

  // Découpage par colonnes quand les en-têtes ont été localisés ; sinon on
  // s'en remet à l'ordre de lecture, la norme suivant toujours la valeur.
  const splitX = referenceX === null ? Number.POSITIVE_INFINITY : referenceX - margin;
  const leftItems = inScope.filter((i) => i.x < splitX);
  const rightItems = inScope.filter((i) => i.x >= splitX);

  const text = joinItems(inScope);
  if (!text) return { kind: "none" };

  const leftText = joinItems(leftItems);
  const rightText = joinItems(rightItems);

  const range = rightItems.length
    ? findReferenceRange(rightText)
    : findReferenceRange(text);
  const beforeRange = rightItems.length
    ? leftText
    : range
      ? text.slice(0, range.index)
      : text;
  if (!beforeRange) {
    return { kind: "none" };
  }

  // Toutes les mesures écrites avant l'intervalle de référence sont retenues :
  // une même ligne en porte parfois deux (pourcentage puis valeur absolue).
  VALUE_WITH_UNIT.lastIndex = 0;
  const candidates: Candidate[] = [];
  let match: RegExpExecArray | null;
  while ((match = VALUE_WITH_UNIT.exec(beforeRange)) !== null) {
    // Bornes du nombre seul : match[0] englobe l'espace et l'unité, dont la
    // première lettre ferait échouer le test à tort.
    if (!isStandaloneNumber(beforeRange, match.index, match.index + match[1].length)) continue;
    const value = parseNumber(match[1]);
    if (value === null) continue;
    candidates.push({
      value,
      unit: match[2] ? canonicalUnit(match[2]) : undefined,
      index: match.index,
    });
  }

  if (!candidates.length) {
    // Pas de valeur : peut-être un intitulé de section nommant un marqueur.
    const sectionMarker = matchMarker(beforeRange, { fuzzy });
    return sectionMarker ? { kind: "section", markerKey: sectionMarker.key } : { kind: "none" };
  }

  // Le nom du marqueur précède ses valeurs, mais peut lui-même contenir un
  // nombre (« 25 OH vitamine D », « Alpha 1 globulines ») : on élargit le
  // libellé de proche en proche jusqu'à reconnaître un marqueur.
  let marker: Marker | null = null;
  let firstValue = 0;
  for (let i = 0; i < candidates.length; i++) {
    const found = matchMarker(cleanLabel(beforeRange.slice(0, candidates[i].index)), { fuzzy });
    if (found) {
      marker = found;
      firstValue = i;
      break;
    }
  }

  const rawLabel = cleanLabel(beforeRange.slice(0, candidates[firstValue].index));

  if (!marker) {
    const last = candidates[candidates.length - 1];
    return {
      kind: "orphan",
      value: last.value,
      unit: last.unit,
      refLow: range?.low,
      refHigh: range?.high,
      rawLabel,
    };
  }

  const picked = chooseCandidate(candidates.slice(firstValue), marker, range);

  return {
    kind: "result",
    result: {
      markerKey: marker.key,
      label: marker.label,
      rawLabel,
      value: picked.value,
      unit: picked.unit ?? marker.unit,
      unitGuessed: !picked.unit,
      refLow: range?.low,
      refHigh: range?.high,
      refSource: range ? "laboratoire" : "aucune",
      page: row.page,
    },
  };
}

function extractMetadata(rows: PdfRow[]) {
  const meta: Pick<ExtractionOutcome, "detectedSex" | "detectedAge" | "sampleDate" | "labName"> = {};
  for (const row of rows) {
    const t = row.text;
    if (!meta.detectedSex) {
      // « Sexe: F » chez les uns, « LEPAIN Charlene (F) » chez les autres.
      const sex = /sexe\s*:?\s*([FM])\b/i.exec(t) ?? /\(([FM])\)/.exec(t);
      if (sex) meta.detectedSex = sex[1].toUpperCase() as Sex;
    }
    if (meta.detectedAge === undefined) {
      const age = /\(?\s*(\d{1,3})\s*ans\s*\)?/i.exec(t);
      if (age && Number(age[1]) > 0 && Number(age[1]) < 120) meta.detectedAge = Number(age[1]);
    }
    if (!meta.sampleDate) {
      const date =
        /pr[ée]l[eè]v[ée](?:ment)?\s+(?:le|du)\s+(\d{2})[-/](\d{2})[-/](\d{2,4})/i.exec(t);
      if (date) {
        const year = date[3].length === 2 ? `20${date[3]}` : date[3];
        meta.sampleDate = `${year}-${date[2]}-${date[1]}`;
      }
    }
    if (!meta.labName && /^laboratoire\b/i.test(t.trim())) meta.labName = t.trim().slice(0, 80);
  }
  return meta;
}

function readRows(rows: PdfRow[], margin: number, fuzzy: boolean): ExtractedResult[] {
  const columns = findColumns(rows);
  const results: ExtractedResult[] = [];
  const seen = new Set<string>();
  let pendingSection: string | null = null;

  for (const row of rows) {
    const reading = readRow(row, columns, margin, fuzzy);

    if (reading.kind === "section") {
      if (!seen.has(reading.markerKey)) pendingSection = reading.markerKey;
      continue;
    }

    if (reading.kind === "orphan") {
      const hasRange = reading.refLow !== undefined || reading.refHigh !== undefined;

      // D'abord, rattachement à l'intitulé de section juste au-dessus : le nom
      // du marqueur est parfois seul sur sa ligne, la valeur sur la suivante.
      const marker = pendingSection && !seen.has(pendingSection) ? MARKERS_BY_KEY[pendingSection] : undefined;
      if (marker) {
        seen.add(marker.key);
        results.push({
          markerKey: marker.key,
          label: marker.label,
          rawLabel: reading.rawLabel,
          value: reading.value,
          unit: reading.unit ?? marker.unit,
          unitGuessed: !reading.unit,
          refLow: reading.refLow,
          refHigh: reading.refHigh,
          refSource: hasRange ? "laboratoire" : "aucune",
          page: row.page,
        });
        pendingSection = null;
        continue;
      }

      // Sinon on garde quand même la mesure, sans marqueur associé : mieux vaut
      // afficher « Bloo ne sait pas encore expliquer ceci » que de faire
      // disparaître silencieusement une ligne de l'analyse.
      if (!looksLikeResult(reading.rawLabel, hasRange)) continue;
      const key = normalize(reading.rawLabel);
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({
        markerKey: null,
        label: reading.rawLabel,
        rawLabel: reading.rawLabel,
        value: reading.value,
        unit: reading.unit ?? "",
        unitGuessed: !reading.unit,
        refLow: reading.refLow,
        refHigh: reading.refHigh,
        refSource: hasRange ? "laboratoire" : "aucune",
        page: row.page,
      });
      continue;
    }

    if (reading.kind === "result") {
      pendingSection = null;
      if (seen.has(reading.result.markerKey!)) continue;
      seen.add(reading.result.markerKey!);
      results.push(reading.result);
    }
  }

  return results;
}

/**
 * Lit un compte rendu de laboratoire et en tire les marqueurs reconnus.
 *
 * Deux chemins, le second en repli du premier : la couche texte du PDF quand
 * elle existe, la reconnaissance optique quand le document est un scan. Les
 * deux s'exécutent intégralement en local.
 */
export async function extractFromPdf(
  data: Uint8Array,
  onOcrProgress?: (p: OcrProgress) => void,
): Promise<ExtractionOutcome> {
  const { rows, isScanned } = await extractPdfText(data);

  if (!isScanned) {
    const results = readRows(rows, 12, false);
    if (results.length > 0) {
      return { results, source: "texte", rowsScanned: rows.length, ...extractMetadata(rows) };
    }
  }

  // Scan, ou couche texte présente mais inexploitable : on passe à l'OCR.
  const ocrRows = await ocrPdfPages(data, onOcrProgress);
  return {
    // L'OCR déforme les libellés (« SOCIUM » pour Sodium) : la correspondance
    // tolérante n'est activée que sur ce chemin.
    results: readRows(ocrRows, 24, true),
    source: "ocr",
    rowsScanned: ocrRows.length,
    ...extractMetadata(ocrRows),
  };
}
