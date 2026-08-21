import { CATEGORY_LABELS, type MarkerCategory } from "@/lib/markers/types";
import { MARKERS_BY_KEY } from "@/lib/markers/catalog";
import { detectPatterns, type DetectedPattern } from "./patterns";
import type { EvaluatedResult } from "./status";

export interface ReportMarkerNote {
  /** `null` pour un marqueur absent du catalogue : pas de fiche de glossaire. */
  markerKey: string | null;
  label: string;
  value: number;
  unit: string;
  low?: number;
  high?: number;
  status: EvaluatedResult["status"];
  marked: boolean;
  /** Ce que cet écart peut traduire, tiré du glossaire. */
  text: string;
}

export interface ReportSection {
  id: string;
  title: string;
  tone: "good" | "watch" | "neutral";
  paragraphs: string[];
  notes?: ReportMarkerNote[];
  patterns?: DetectedPattern[];
  /** Marqueurs simplement listés, sans commentaire. */
  chips?: string[];
}

export interface Report {
  generatedAt: string;
  engine: "local";
  summary: {
    total: number;
    outOfRange: number;
    marked: number;
    normal: number;
    /** Mesures lues que Bloo situe mais ne sait pas encore expliquer. */
    uncatalogued: number;
  };
  headline: string;
  sections: ReportSection[];
  questions: string[];
  disclaimer: string;
}

export const DISCLAIMER =
  "Bloo n'est pas un médecin et ne pose aucun diagnostic. Ce compte rendu est une aide à la compréhension : " +
  "il explique ce que les marqueurs mesurent et ce qu'un écart peut traduire, en termes généraux. Un résultat " +
  "ne prend son sens qu'avec l'histoire, l'examen et le contexte de la personne — seul un professionnel de santé " +
  "peut faire ce travail. En cas de doute ou de symptôme, parles-en à ton médecin.";

/** Questions utiles selon le profil détecté, pour préparer la consultation. */
const QUESTIONS_BY_PATTERN: Record<string, string[]> = {
  carence_martiale: [
    "D'où vient ce manque de fer, et faut-il en chercher la cause ?",
    "Une supplémentation est-elle indiquée, et pour combien de temps ?",
  ],
  reserves_fer_seules: ["Faut-il surveiller ces réserves de fer ou agir dès maintenant ?"],
  ferritine_inflammation: [
    "Cette ferritine élevée vient-elle de l'inflammation ou d'une vraie surcharge en fer ?",
  ],
  surcharge_fer: ["Faut-il explorer une surcharge en fer d'origine génétique ?"],
  anemie_macrocytaire: ["Un dosage de la vitamine B12 et des folates est-il justifié ?"],
  inflammation_active: ["Cette inflammation nécessite-t-elle un contrôle à distance ?"],
  crp_isolee: ["Faut-il recontrôler cette CRP, et à quel délai ?"],
  syndrome_metabolique: [
    "Quels changements auraient le plus d'effet sur ces résultats dans les prochains mois ?",
  ],
  prediabete: ["À quel rythme faut-il surveiller la glycémie ou l'hémoglobine glyquée ?"],
  foie_transaminases: ["Faut-il recontrôler le bilan hépatique, et faire une échographie ?"],
  ggt_isolee: ["Cette gamma-GT isolée demande-t-elle un examen complémentaire ?"],
  effort_musculaire: ["Faut-il recontrôler après quelques jours sans activité physique ?"],
  hypothyroidie: ["Faut-il compléter par une T4 libre et des anticorps anti-TPO ?"],
  hyperthyroidie: ["Quels examens complémentaires pour préciser cette thyroïde ?"],
  rein_dfg: ["Cette filtration rénale doit-elle être surveillée, et à quelle fréquence ?"],
  vitamine_d_deficit: ["Quelle supplémentation en vitamine D, et à quelle dose ?"],
  ldl_eleve: ["Quel niveau de LDL viser compte tenu de mon risque cardiovasculaire global ?"],
};

function buildHeadline(
  outOfRange: number,
  marked: number,
  total: number,
  uncatalogued: number,
): string {
  // Dire ce qui n'est pas expliqué fait partie du compte rendu : l'utilisateur
  // doit savoir que sa lecture est partielle, et sur quels points.
  const caveat = uncatalogued
    ? ` ${uncatalogued} d'entre eux ne figurent pas encore à mon catalogue : je te dis s'ils sont dans l'intervalle du laboratoire, sans pouvoir les expliquer.`
    : "";

  if (total === 0) {
    return "Aucun marqueur n'a pu être lu dans ce document. Ajoute des résultats à la main pour que Bloo puisse t'aider.";
  }
  if (outOfRange === 0) {
    return `Bonne nouvelle : les ${total} marqueurs comparés à une norme se situent tous dans l\u2019intervalle attendu. Rien ne ressort de ce bilan.${caveat}`;
  }
  if (marked === 0) {
    return `Sur ${total} marqueurs comparés à une norme, ${outOfRange} ${outOfRange > 1 ? "sortent" : "sort"} de l\u2019intervalle attendu, de peu. Des écarts légers sont très courants et souvent sans portée : ce qui compte, c'est leur ensemble et leur évolution dans le temps.${caveat}`;
  }
  return `Sur ${total} marqueurs comparés à une norme, ${outOfRange} ${outOfRange > 1 ? "sortent" : "sort"} de l\u2019intervalle attendu, dont ${marked} de façon nette. Rien ici ne se lit isolément : Bloo t'explique ci-dessous ce que chacun mesure et ce que leur combinaison peut traduire.${caveat}`;
}

const UNKNOWN_MARKER_NOTE =
  "Ce marqueur ne figure pas encore au catalogue de Bloo. Je peux le situer par rapport à " +
  "l'intervalle imprimé par ton laboratoire, mais pas encore t'expliquer ce qu'il mesure ni ce " +
  "qu'un écart peut traduire : c'est une bonne question à poser à ton médecin.";

function noteFor(result: EvaluatedResult): ReportMarkerNote {
  const marker = result.markerKey ? MARKERS_BY_KEY[result.markerKey] : undefined;
  if (!marker) {
    return {
      markerKey: null,
      label: result.label,
      value: result.value,
      unit: result.unit,
      low: result.low,
      high: result.high,
      status: result.status,
      marked: result.marked,
      text: UNKNOWN_MARKER_NOTE,
    };
  }
  const text =
    result.status === "haut"
      ? (marker?.high ?? "")
      : result.status === "bas"
        ? (marker?.low ?? "")
        : "";
  return {
    markerKey: result.markerKey,
    label: result.label,
    value: result.value,
    unit: result.unit,
    low: result.low,
    high: result.high,
    status: result.status,
    marked: result.marked,
    text,
  };
}

/**
 * Construit le compte rendu global à partir des résultats évalués.
 *
 * Tout est calculé sur la machine de l'utilisateur : aucune donnée de santé
 * n'est transmise à un service tiers, et l'application fonctionne hors ligne.
 */
export function buildReport(results: EvaluatedResult[]): Report {
  // Deux populations à ne pas mélanger : ce que Bloo sait expliquer, et ce
  // qu'il sait seulement situer par rapport à la norme du laboratoire.
  const catalogued = results.filter((r) => r.markerKey !== null);
  const uncatalogued = results.filter((r) => r.markerKey === null);

  const known = catalogued.filter((r) => r.status !== "inconnu");
  const outOfRange = known.filter((r) => r.status !== "normal");
  const normal = known.filter((r) => r.status === "normal");
  const noRange = catalogued.filter((r) => r.status === "inconnu");
  const marked = outOfRange.filter((r) => r.marked);

  const uncataloguedOut = uncatalogued.filter((r) => r.status === "haut" || r.status === "bas");
  const uncataloguedOk = uncatalogued.filter((r) => r.status === "normal");
  const patterns = detectPatterns(results);

  const sections: ReportSection[] = [];

  if (outOfRange.length) {
    // Regroupement par famille : plus lisible qu'une liste à plat.
    const byCategory = new Map<string, EvaluatedResult[]>();
    for (const r of outOfRange) {
      if (!byCategory.has(r.category)) byCategory.set(r.category, []);
      byCategory.get(r.category)!.push(r);
    }
    for (const [category, items] of byCategory) {
      sections.push({
        id: `hors-normes-${category}`,
        title: CATEGORY_LABELS[category as MarkerCategory] ?? "Autres marqueurs",
        tone: "watch",
        paragraphs: [],
        notes: items.map(noteFor),
      });
    }
  }

  if (uncataloguedOut.length) {
    sections.push({
      id: "hors-normes-non-repertories",
      title: "Hors norme, mais pas encore au catalogue de Bloo",
      tone: "watch",
      paragraphs: [
        "Ces mesures sortent de l'intervalle imprimé par ton laboratoire. Bloo ne sait pas encore " +
          "ce qu'elles représentent, mais il préfère te les montrer plutôt que de les passer sous silence.",
      ],
      notes: uncataloguedOut.map(noteFor),
    });
  }

  if (patterns.length) {
    sections.push({
      id: "recoupements",
      title: "Ce que ces résultats peuvent traduire ensemble",
      tone: "neutral",
      paragraphs: [
        "Un marqueur isolé dit rarement grand-chose. Voici les rapprochements que Bloo repère entre tes résultats.",
      ],
      patterns,
    });
  }

  if (normal.length) {
    sections.push({
      id: "dans-les-normes",
      title: "Ce qui est dans les normes",
      tone: "good",
      paragraphs: [
        `${normal.length} marqueur${normal.length > 1 ? "s se situent" : " se situe"} dans l'intervalle attendu.`,
      ],
      chips: normal.map((r) => r.label),
    });
  }

  if (uncataloguedOk.length) {
    sections.push({
      id: "non-repertories",
      title: "Dans les normes, mais pas encore au catalogue",
      tone: "good",
      paragraphs: [
        `${uncataloguedOk.length} mesure${uncataloguedOk.length > 1 ? "s se situent" : " se situe"} dans ` +
          "l'intervalle imprimé par ton laboratoire, sans que Bloo sache encore expliquer de quoi il s'agit.",
      ],
      chips: uncataloguedOk.map((r) => `${r.label} : ${r.value} ${r.unit}`.trim()),
    });
  }

  if (noRange.length) {
    sections.push({
      id: "sans-norme",
      title: "Lus, mais sans norme de comparaison",
      tone: "neutral",
      paragraphs: [
        "Pour ces marqueurs, aucune plage de référence n'a été trouvée — ni imprimée sur le compte rendu, ni dans le catalogue de Bloo pour cette unité. Tu peux compléter la norme à la main sur la fiche de l'analyse.",
      ],
      chips: noRange.map((r) => `${r.label} : ${r.value} ${r.unit}`.trim()),
    });
  }

  const questions = new Set<string>();
  for (const pattern of patterns) {
    for (const q of QUESTIONS_BY_PATTERN[pattern.id] ?? []) questions.add(q);
  }
  if (marked.length && questions.size < 5) {
    questions.add("Ces écarts justifient-ils un examen complémentaire ou un simple contrôle à distance ?");
  }
  if (outOfRange.length && !questions.size) {
    questions.add("Ces écarts légers appellent-ils quelque chose, ou peut-on simplement les surveiller ?");
  }

  return {
    generatedAt: new Date().toISOString(),
    engine: "local",
    summary: {
      total: results.length,
      outOfRange: outOfRange.length + uncataloguedOut.length,
      marked: marked.length,
      normal: normal.length + uncataloguedOk.length,
      uncatalogued: uncatalogued.length,
    },
    headline: buildHeadline(
      outOfRange.length + uncataloguedOut.length,
      marked.length,
      known.length + uncatalogued.length,
      uncatalogued.length,
    ),
    sections,
    questions: [...questions],
    disclaimer: DISCLAIMER,
  };
}
