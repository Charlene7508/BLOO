import type { EvaluatedResult, MarkerStatus } from "./status";

export interface PatternContext {
  byKey: Map<string, EvaluatedResult>;
  is: (key: string, status: MarkerStatus) => boolean;
  has: (key: string) => boolean;
}

export interface DetectedPattern {
  id: string;
  title: string;
  text: string;
  /** Marqueurs qui ont déclenché la règle, mis en avant dans le compte rendu. */
  markers: string[];
}

interface PatternRule {
  id: string;
  title: string;
  markers: string[];
  when: (c: PatternContext) => boolean;
  text: string;
}

/**
 * Règles de recoupement entre marqueurs.
 *
 * C'est ce qui distingue un compte rendu d'une simple liste : un résultat isolé
 * ne veut souvent pas dire la même chose selon ce qui l'accompagne. Ces règles
 * restent descriptives — elles décrivent des profils, elles ne posent aucun
 * diagnostic, qui relève du médecin seul.
 */
const RULES: PatternRule[] = [
  {
    id: "carence_martiale",
    title: "Un profil qui évoque un manque de fer",
    markers: ["ferritine", "hemoglobine", "vgm"],
    when: (c) =>
      c.is("ferritine", "bas") && (c.is("hemoglobine", "bas") || c.is("vgm", "bas")),
    text:
      "Des réserves de fer basses accompagnées d'une hémoglobine ou de globules rouges plus petits que la normale dessinent le tableau classique de la carence en fer. Chez la femme non ménopausée, les règles abondantes en sont de loin la première cause. C'est une situation fréquente et qui se corrige bien, mais elle mérite d'en chercher l'origine avec un médecin plutôt que de se supplémenter seule.",
  },
  {
    id: "reserves_fer_seules",
    title: "Des réserves de fer entamées, sans anémie",
    markers: ["ferritine", "hemoglobine"],
    when: (c) => c.is("ferritine", "bas") && c.is("hemoglobine", "normal"),
    text:
      "Les réserves de fer sont basses alors que l'hémoglobine tient encore bon. C'est le stade précoce : l'organisme puise dans son stock sans que le transport d'oxygène soit encore touché. Cela suffit souvent à expliquer une fatigue ou un essoufflement à l'effort.",
  },
  {
    id: "ferritine_inflammation",
    title: "Une ferritine à relire à la lumière de l'inflammation",
    markers: ["ferritine", "crp"],
    when: (c) => c.is("ferritine", "haut") && c.is("crp", "haut"),
    text:
      "La ferritine est élevée, mais la CRP l'est aussi. Or la ferritine monte lors de toute inflammation, indépendamment des réserves de fer : son élévation ici ne signifie pas forcément une surcharge. Le coefficient de saturation de la transferrine est l'examen qui permet de trancher.",
  },
  {
    id: "surcharge_fer",
    title: "Une saturation en fer qui mérite un avis",
    markers: ["cst", "ferritine"],
    when: (c) => c.is("cst", "haut"),
    text:
      "Le coefficient de saturation de la transferrine est au-dessus de la norme. C'est le principal signal d'alerte d'une surcharge en fer, dont la forme génétique (hémochromatose) est loin d'être rare et se dépiste simplement. Ce résultat justifie d'en parler à un médecin.",
  },
  {
    id: "anemie_macrocytaire",
    title: "Une anémie à gros globules rouges",
    markers: ["hemoglobine", "vgm", "vitamine_b12", "folates"],
    when: (c) => c.is("hemoglobine", "bas") && c.is("vgm", "haut"),
    text:
      "L'hémoglobine est basse et les globules rouges sont plus gros que la normale. Cette association oriente vers un manque de vitamine B12 ou de folates, une consommation régulière d'alcool, ou une thyroïde ralentie. Le dosage de la B12 et des folates est l'étape logique suivante.",
  },
  {
    id: "inflammation_active",
    title: "Des signes d'inflammation au moment du prélèvement",
    markers: ["crp", "leucocytes", "neutrophiles", "vs"],
    when: (c) => c.is("crp", "haut") && (c.is("leucocytes", "haut") || c.is("neutrophiles", "haut")),
    text:
      "La CRP et les globules blancs sont élevés en même temps : l'organisme réagissait à quelque chose au moment de la prise de sang, le plus souvent une infection. Ces marqueurs bougent vite ; un contrôle à distance, une fois l'épisode passé, dit s'il s'agissait d'un simple passage.",
  },
  {
    id: "crp_isolee",
    title: "Une inflammation isolée et modérée",
    markers: ["crp"],
    when: (c) => c.is("crp", "haut") && !c.is("leucocytes", "haut") && !c.is("neutrophiles", "haut"),
    text:
      "La CRP est un peu au-dessus de la norme sans que les globules blancs suivent. Une infection banale récente, une blessure, un effort intense ou une inflammation de bas grade suffisent à l'expliquer. Isolée et modérée, elle se recontrôle simplement à distance.",
  },
  {
    id: "syndrome_metabolique",
    title: "Un profil métabolique à surveiller",
    markers: ["triglycerides", "hdl", "glycemie", "hba1c"],
    when: (c) =>
      c.is("triglycerides", "haut") && (c.is("hdl", "bas") || c.is("glycemie", "haut")),
    text:
      "Des triglycérides élevés associés à un bon cholestérol bas ou à une glycémie qui grimpe forment un ensemble cohérent, souvent lié à l'alimentation et à la sédentarité. C'est le terrain sur lequel l'activité physique régulière et la réduction des sucres rapides ont le plus d'effet, et l'un des rares où quelques mois suffisent à inverser la tendance.",
  },
  {
    id: "prediabete",
    title: "Une glycémie dans la zone d'alerte",
    markers: ["glycemie", "hba1c"],
    when: (c) => {
      const gly = c.byKey.get("glycemie");
      const hba = c.byKey.get("hba1c");
      const glyAlerte = gly?.unit === "g/L" && gly.value >= 1.1 && gly.value < 1.26;
      const hbaAlerte = hba?.unit === "%" && hba.value >= 5.7 && hba.value < 6.5;
      return Boolean(glyAlerte || hbaAlerte);
    },
    text:
      "Les valeurs se situent dans la zone dite de prédiabète : au-dessus de la normale, en dessous du seuil du diabète. Cette étape est réversible, et c'est précisément ce qui la rend importante à repérer tôt. Un contrôle à quelques mois permet de voir dans quel sens les choses évoluent.",
  },
  {
    id: "foie_transaminases",
    title: "Un foie qui donne des signes de sollicitation",
    markers: ["alat", "asat", "ggt"],
    when: (c) => c.is("alat", "haut") || (c.is("asat", "haut") && c.is("ggt", "haut")),
    text:
      "Les enzymes du foie sont au-dessus de la norme. Les causes les plus fréquentes sont bénignes et réversibles : excès de graisse dans le foie lié au surpoids, alcool, médicaments courants. Une élévation modérée se recontrôle à distance ; si elle persiste, une échographie et un bilan complémentaire sont les étapes habituelles.",
  },
  {
    id: "ggt_isolee",
    title: "Une gamma-GT isolée",
    markers: ["ggt", "alat", "asat"],
    when: (c) => c.is("ggt", "haut") && !c.is("alat", "haut") && !c.is("asat", "haut"),
    text:
      "Seule la gamma-GT est élevée, les autres enzymes du foie sont normales. C'est une situation très courante et rarement inquiétante : cette enzyme est extrêmement sensible et réagit à l'alcool même modéré, à de nombreux médicaments et au surpoids.",
  },
  {
    id: "effort_musculaire",
    title: "Des marqueurs qui sentent l'effort physique",
    markers: ["cpk", "asat", "alat"],
    when: (c) => c.is("cpk", "haut") && !c.is("alat", "haut"),
    text:
      "Les enzymes musculaires sont élevées alors que les enzymes propres au foie restent normales. Un effort physique intense dans les jours précédant la prise de sang suffit largement à produire ce profil. Pour y voir clair, l'usage est de recontrôler après quelques jours sans sport.",
  },
  {
    id: "hypothyroidie",
    title: "Une thyroïde qui semble tourner au ralenti",
    markers: ["tsh", "t4l"],
    when: (c) => c.is("tsh", "haut"),
    text:
      "La TSH est élevée, ce qui traduit un cerveau qui « pousse » une thyroïde jugée insuffisante. La T4 libre précise s'il s'agit d'une hypothyroïdie installée ou d'une forme fruste, souvent simplement surveillée. Fatigue, frilosité et prise de poids sont les signes qui accompagnent ce tableau.",
  },
  {
    id: "hyperthyroidie",
    title: "Une thyroïde qui semble trop active",
    markers: ["tsh", "t4l", "t3l"],
    when: (c) => c.is("tsh", "bas"),
    text:
      "La TSH est basse, ce qui va dans le sens d'une thyroïde trop active. La T4 et la T3 libres confirment ou non cette impression. Palpitations, nervosité, amaigrissement ou intolérance à la chaleur sont les manifestations habituelles.",
  },
  {
    id: "rein_dfg",
    title: "Une filtration rénale à suivre",
    markers: ["dfg", "creatinine"],
    when: (c) => {
      const dfg = c.byKey.get("dfg");
      return Boolean(dfg && dfg.value < 90);
    },
    text:
      "Le débit de filtration estimé est en dessous de 90. Entre 60 et 90, on parle de filtration légèrement diminuée : c'est fréquent, souvent lié à l'âge ou à une simple déshydratation le jour du prélèvement, et sans conséquence en soi. En dessous de 60 et de façon durable, un suivi médical s'impose.",
  },
  {
    id: "deshydratation",
    title: "Des résultats qui évoquent un manque d'eau",
    markers: ["uree", "creatinine", "proteines_totales", "sodium"],
    when: (c) =>
      (c.is("uree", "haut") && c.is("creatinine", "haut")) ||
      (c.is("sodium", "haut") && c.is("proteines_totales", "haut")),
    text:
      "Plusieurs paramètres montent ensemble d'une façon typique d'un sang plus concentré. Une hydratation insuffisante les jours précédant le prélèvement suffit souvent à l'expliquer et se corrige tout aussi simplement.",
  },
  {
    id: "lymphopenie_isolee",
    title: "Des lymphocytes bas, isolément",
    markers: ["lymphocytes", "leucocytes"],
    when: (c) => c.is("lymphocytes", "bas") && !c.is("neutrophiles", "bas"),
    text:
      "Les lymphocytes sont sous la norme alors que les autres lignées sont préservées. Une infection virale récente, un stress important ou un traitement par corticoïdes suffisent à produire cette baisse passagère. L'usage est de recontrôler à distance avant d'en tirer la moindre conclusion.",
  },
  {
    id: "vitamine_d_deficit",
    title: "Un déficit en vitamine D",
    markers: ["vitamine_d"],
    when: (c) => c.is("vitamine_d", "bas"),
    text:
      "La vitamine D est en dessous de la zone souhaitable. C'est extrêmement fréquent en France, en particulier entre octobre et avril, où l'ensoleillement ne suffit plus à en fabriquer. Fatigue et douleurs musculaires diffuses y sont souvent associées, et la correction par supplémentation est simple.",
  },
  {
    id: "ldl_eleve",
    title: "Un cholestérol LDL au-dessus de la cible générale",
    markers: ["ldl", "hdl", "cholesterol_total"],
    when: (c) => c.is("ldl", "haut"),
    text:
      "Le LDL dépasse le seuil général. Attention toutefois : il n'existe pas de cible universelle. Le niveau à viser dépend du risque cardiovasculaire global — âge, tension, tabac, diabète, antécédents familiaux — et c'est le médecin qui le fixe. Un LDL identique n'appelle pas la même conduite chez deux personnes différentes.",
  },
];

export function detectPatterns(results: EvaluatedResult[]): DetectedPattern[] {
  // Les recoupements ne portent que sur les marqueurs du catalogue : sans
  // savoir ce qu'une mesure représente, on ne peut rien en rapprocher.
  const byKey = new Map(
    results.filter((r) => r.markerKey !== null).map((r) => [r.markerKey as string, r]),
  );
  const context: PatternContext = {
    byKey,
    is: (key, status) => byKey.get(key)?.status === status,
    has: (key) => byKey.has(key),
  };

  return RULES.filter((rule) => {
    // Une règle ne se déclenche que si au moins un de ses marqueurs a été mesuré.
    if (!rule.markers.some((m) => byKey.has(m))) return false;
    return rule.when(context);
  }).map(({ id, title, text, markers }) => ({
    id,
    title,
    text,
    markers: markers.filter((m) => byKey.has(m)),
  }));
}
