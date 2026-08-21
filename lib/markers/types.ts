export type Sex = "F" | "M";

export type MarkerCategory =
  | "hematologie"
  | "fer"
  | "renal"
  | "hepatique"
  | "proteines"
  | "coagulation"
  | "hormones"
  | "cardiaque"
  | "tumoraux"
  | "lipides"
  | "glycemie"
  | "thyroide"
  | "inflammation"
  | "vitamines"
  | "ionogramme"
  | "autres";

export const CATEGORY_LABELS: Record<MarkerCategory, string> = {
  hematologie: "Numération sanguine",
  fer: "Fer et réserves",
  renal: "Reins",
  hepatique: "Foie",
  proteines: "Protéines et immunité",
  coagulation: "Coagulation",
  hormones: "Hormones",
  cardiaque: "Cœur",
  tumoraux: "Marqueurs tumoraux",
  lipides: "Cholestérol et graisses",
  glycemie: "Sucre dans le sang",
  thyroide: "Thyroïde",
  inflammation: "Inflammation",
  vitamines: "Vitamines",
  ionogramme: "Sels minéraux",
  autres: "Autres marqueurs",
};

/** Plage de référence du catalogue, utilisée seulement si le labo n'en fournit pas. */
export interface CatalogRange {
  /** Si absent, la plage s'applique aux deux sexes. */
  sex?: Sex;
  unit: string;
  low?: number;
  high?: number;
}

export interface Marker {
  key: string;
  label: string;
  /** Libellés rencontrés sur les comptes rendus de laboratoire. */
  aliases: string[];
  category: MarkerCategory;
  /** Unité la plus courante, affichée par défaut en saisie manuelle. */
  unit: string;
  ranges: CatalogRange[];
  /** Glossaire : à quoi sert ce marqueur. */
  about: string;
  /** Ce qu'une valeur au-dessus de la norme peut traduire. */
  high: string;
  /** Ce qu'une valeur en dessous de la norme peut traduire. */
  low: string;
}
