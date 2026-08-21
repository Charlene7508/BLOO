import type { Marker } from "./types";

/**
 * Catalogue des marqueurs reconnus par Bloo.
 *
 * Les plages `ranges` ne servent QUE de repli : quand le compte rendu du
 * laboratoire imprime son propre intervalle de référence, c'est toujours celui
 * du laboratoire qui fait foi (les techniques d'analyse varient d'un labo à
 * l'autre). Valeurs adultes ; Bloo ne couvre pas la pédiatrie.
 */
export const MARKERS: Marker[] = [
  // ─────────────────────────── Numération sanguine ───────────────────────────
  {
    key: "hematies",
    label: "Hématies (globules rouges)",
    aliases: ["hematies", "hematie", "globules rouges", "gr", "erythrocytes", "rbc", "numeration erythrocytaire"],
    category: "hematologie",
    unit: "T/L",
    ranges: [
      { sex: "F", unit: "T/L", low: 3.8, high: 5.2 },
      { sex: "M", unit: "T/L", low: 4.3, high: 5.9 },
    ],
    about:
      "Les hématies sont les cellules qui transportent l'oxygène des poumons vers tous les organes, grâce à l'hémoglobine qu'elles contiennent. Leur nombre se lit toujours avec l'hémoglobine et le VGM.",
    high:
      "Un nombre élevé peut refléter une simple déshydratation (le sang est plus concentré), un séjour en altitude, le tabagisme, une apnée du sommeil, ou plus rarement une production excessive par la moelle osseuse.",
    low:
      "Un nombre abaissé accompagne le plus souvent une anémie : manque de fer, de vitamine B12 ou de folates, saignements (règles abondantes notamment), inflammation prolongée ou maladie rénale.",
  },
  {
    key: "hemoglobine",
    label: "Hémoglobine",
    aliases: ["hemoglobine", "hb", "hgb", "taux d hemoglobine"],
    category: "hematologie",
    unit: "g/dL",
    ranges: [
      { sex: "F", unit: "g/dL", low: 12, high: 16 },
      { sex: "M", unit: "g/dL", low: 13, high: 17.5 },
      { sex: "F", unit: "g/L", low: 120, high: 160 },
      { sex: "M", unit: "g/L", low: 130, high: 175 },
    ],
    about:
      "L'hémoglobine est la protéine des globules rouges qui fixe l'oxygène. C'est elle, et non le nombre d'hématies, qui définit l'anémie. Sa baisse explique fatigue, essoufflement à l'effort et pâleur.",
    high:
      "Une hémoglobine élevée va souvent de pair avec une déshydratation, le tabagisme, l'altitude ou un manque d'oxygène chronique ; plus rarement, une production excessive de globules rouges.",
    low:
      "C'est la définition même de l'anémie. Les causes les plus fréquentes sont le manque de fer, les pertes de sang, une carence en vitamine B12 ou folates, une inflammation chronique ou une atteinte rénale.",
  },
  {
    key: "hematocrite",
    label: "Hématocrite",
    aliases: ["hematocrite", "ht", "hct"],
    category: "hematologie",
    unit: "%",
    ranges: [
      { sex: "F", unit: "%", low: 36, high: 46 },
      { sex: "M", unit: "%", low: 40, high: 52 },
    ],
    about:
      "L'hématocrite est la part du volume sanguin occupée par les globules rouges. Il évolue presque toujours dans le même sens que l'hémoglobine et renseigne aussi sur l'état d'hydratation.",
    high:
      "Un hématocrite élevé signale un sang plus concentré : déshydratation, tabagisme, altitude, apnée du sommeil, ou production excessive de globules rouges.",
    low:
      "Un hématocrite abaissé accompagne l'anémie, une hémodilution (excès d'eau dans le sang, grossesse notamment) ou des saignements.",
  },
  {
    key: "vgm",
    label: "V.G.M. (volume globulaire moyen)",
    aliases: ["vgm", "v.g.m.", "volume globulaire moyen", "mcv", "volume moyen des hematies"],
    category: "hematologie",
    unit: "fL",
    ranges: [{ unit: "fL", low: 80, high: 100 }],
    about:
      "Le VGM mesure la taille moyenne des globules rouges. C'est la boussole de l'anémie : il oriente vers la cause bien avant tout autre examen.",
    high:
      "Des globules rouges trop gros (macrocytose) évoquent un manque de vitamine B12 ou de folates, une consommation d'alcool régulière, une thyroïde ralentie, ou certains médicaments.",
    low:
      "Des globules rouges trop petits (microcytose) orientent vers un manque de fer, une inflammation chronique, ou une particularité constitutionnelle de l'hémoglobine (thalassémie).",
  },
  {
    key: "tcmh",
    label: "T.C.M.H. (teneur corpusculaire moyenne en hémoglobine)",
    aliases: ["tcmh", "t.c.m.h.", "teneur corpusculaire moyenne en hemoglobine", "mch", "hemoglobine corpusculaire moyenne"],
    category: "hematologie",
    unit: "pg",
    ranges: [{ unit: "pg", low: 27, high: 33 }],
    about:
      "La TCMH est la quantité moyenne d'hémoglobine contenue dans un globule rouge. Elle suit presque toujours le VGM et affine la lecture d'une anémie.",
    high:
      "Une TCMH élevée accompagne généralement des globules rouges de grande taille : carence en vitamine B12 ou en folates, alcool, thyroïde ralentie.",
    low:
      "Une TCMH basse signale des globules rouges pauvres en hémoglobine, typiquement par manque de fer ou par inflammation prolongée.",
  },
  {
    key: "ccmh",
    label: "C.C.M.H. (concentration corpusculaire moyenne en hémoglobine)",
    aliases: ["ccmh", "c.c.m.h.", "concentration corpusculaire moyenne en hemoglobine", "mchc"],
    category: "hematologie",
    unit: "g/dL",
    ranges: [{ unit: "g/dL", low: 32, high: 36 }],
    about:
      "La CCMH indique à quel point les globules rouges sont « remplis » d'hémoglobine. Elle varie peu et sort rarement des normes de façon isolée.",
    high:
      "Une CCMH élevée est souvent un artefact technique (prélèvement, agglutination) ; plus rarement, elle évoque une fragilité particulière des globules rouges.",
    low:
      "Une CCMH basse accompagne les anémies par manque de fer ou par inflammation, avec des globules rouges plus pâles que la normale.",
  },
  {
    key: "idr",
    label: "I.D.R. (indice de distribution des hématies)",
    aliases: ["idr", "i.d.r.", "indice de distribution des hematies", "rdw", "indice de distribution"],
    category: "hematologie",
    unit: "%",
    ranges: [{ unit: "%", low: 11.5, high: 14.5 }],
    about:
      "L'IDR mesure à quel point les globules rouges ont des tailles hétérogènes. Il monte souvent tôt, avant même que l'hémoglobine ne baisse.",
    high:
      "Une hétérogénéité marquée s'observe au début d'une carence (fer, B12, folates), quand cohabitent d'anciens globules normaux et de nouveaux anormaux, ou après une transfusion.",
    low:
      "Un IDR bas n'a pas de signification inquiétante : il traduit une population de globules rouges très homogène.",
  },
  {
    key: "leucocytes",
    label: "Leucocytes (globules blancs)",
    aliases: ["leucocytes", "globules blancs", "gb", "wbc", "numeration leucocytaire"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 4, high: 10 }],
    about:
      "Les leucocytes sont les cellules de défense de l'organisme. Leur total se décompose en plusieurs familles (neutrophiles, lymphocytes, monocytes, éosinophiles, basophiles), et c'est ce détail qui oriente.",
    high:
      "Une élévation accompagne le plus souvent une infection en cours, une inflammation, un stress important, le tabagisme, une corticothérapie ; une hausse forte et persistante demande un avis médical.",
    low:
      "Une baisse peut suivre une infection virale récente, certains médicaments, une carence en vitamines, ou une origine constitutionnelle bénigne fréquente chez certaines personnes.",
  },
  {
    key: "neutrophiles",
    label: "Polynucléaires neutrophiles",
    aliases: ["polynucleaires neutrophiles", "neutrophiles", "pnn", "polynucleaire neutrophile"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 1.7, high: 7.5 }],
    about:
      "Les neutrophiles sont la première ligne de défense contre les bactéries. Ils forment la famille la plus nombreuse des globules blancs.",
    high:
      "Une hausse évoque une infection bactérienne, une inflammation, un stress physique intense, le tabac, une corticothérapie ou l'exercice récent.",
    low:
      "Une baisse fait suite à une infection virale, à certains médicaments, à une carence en vitamine B12 ou folates ; elle est parfois constitutionnelle et sans conséquence.",
  },
  {
    key: "eosinophiles",
    label: "Polynucléaires éosinophiles",
    aliases: ["polynucleaires eosinophiles", "eosinophiles", "pne", "polynucleaire eosinophile"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 0.05, high: 0.5 }],
    about:
      "Les éosinophiles interviennent dans les réactions allergiques et la défense contre les parasites.",
    high:
      "Une élévation oriente vers une allergie (asthme, rhinite, eczéma), une réaction à un médicament, ou une parasitose — en particulier après un voyage.",
    low:
      "Un taux très bas n'a en général aucune signification pathologique ; il s'observe lors d'un stress aigu ou sous corticoïdes.",
  },
  {
    key: "basophiles",
    label: "Polynucléaires basophiles",
    aliases: ["polynucleaires basophiles", "basophiles", "pnb", "polynucleaire basophile"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 0, high: 0.1 }],
    about:
      "Les basophiles sont les globules blancs les moins nombreux ; ils participent aux réactions allergiques et inflammatoires.",
    high:
      "Une élévation, rare, peut accompagner une allergie, une inflammation chronique ou une thyroïde ralentie.",
    low: "Un taux bas ou nul est habituel et sans signification particulière.",
  },
  {
    key: "lymphocytes",
    label: "Lymphocytes",
    aliases: ["lymphocytes", "lymphocyte", "ly"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 1.0, high: 4.0 }],
    about:
      "Les lymphocytes sont les cellules de la mémoire immunitaire : ils reconnaissent les virus déjà rencontrés et fabriquent les anticorps.",
    high:
      "Une hausse accompagne surtout les infections virales (mononucléose notamment) et certaines infections prolongées.",
    low:
      "Une baisse s'observe après une infection virale récente, sous corticoïdes ou immunosuppresseurs, lors d'un stress important, ou en cas de dénutrition. Isolée et modérée, elle se recontrôle simplement à distance.",
  },
  {
    key: "monocytes",
    label: "Monocytes",
    aliases: ["monocytes", "monocyte", "mono"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 0.2, high: 1.0 }],
    about:
      "Les monocytes sont les « nettoyeurs » de l'organisme : ils absorbent débris et microbes, et prennent le relais des neutrophiles en fin d'infection.",
    high:
      "Une élévation modérée s'observe en phase de récupération d'une infection, lors d'une inflammation chronique ou d'une maladie inflammatoire.",
    low: "Une baisse isolée n'a généralement pas de signification clinique.",
  },
  {
    key: "plaquettes",
    label: "Plaquettes",
    aliases: ["plaquettes", "thrombocytes", "plt", "numeration plaquettaire"],
    category: "hematologie",
    unit: "G/L",
    ranges: [{ unit: "G/L", low: 150, high: 400 }],
    about:
      "Les plaquettes assurent la coagulation : elles s'agrègent pour colmater les vaisseaux blessés et arrêter les saignements.",
    high:
      "Une hausse accompagne fréquemment une inflammation, une carence en fer, une infection, ou suit une chirurgie ; elle est plus rarement liée à la moelle osseuse elle-même.",
    low:
      "Une baisse peut être liée à une infection virale, à un médicament, à une consommation d'alcool régulière, à une maladie du foie — ou être un artefact du prélèvement (agrégats), à recontrôler sur tube citraté.",
  },
  {
    key: "vpm",
    label: "Volume plaquettaire moyen",
    aliases: ["volume plaquettaire moyen", "vpm", "mpv"],
    category: "hematologie",
    unit: "fL",
    ranges: [{ unit: "fL", low: 7.5, high: 12 }],
    about:
      "Le VPM indique la taille moyenne des plaquettes. Les jeunes plaquettes, fraîchement produites, sont plus grosses.",
    high:
      "Un VPM élevé traduit un renouvellement plaquettaire actif : la moelle osseuse produit de nouvelles plaquettes.",
    low: "Un VPM bas évoque des plaquettes plus âgées ou une production ralentie.",
  },
  {
    key: "reticulocytes",
    label: "Réticulocytes",
    aliases: ["reticulocytes", "reticulocyte", "retics"],
    category: "hematologie",
    unit: "/mm3",
    ranges: [
      { unit: "/mm3", low: 25000, high: 100000 },
      { unit: "G/L", low: 25, high: 100 },
      { unit: "%", low: 0.5, high: 2.5 },
    ],
    about:
      "Les réticulocytes sont les globules rouges tout juste sortis de la moelle osseuse. Leur nombre indique à quelle vitesse l'organisme en fabrique : c'est le compteur de production.",
    high:
      "Une production accélérée s'observe après un saignement, après la correction d'une carence (fer, vitamine B12), ou quand les globules rouges sont détruits plus vite que la normale et que la moelle compense.",
    low:
      "Une production insuffisante accompagne une carence non corrigée, une inflammation prolongée ou une atteinte de la moelle. Devant une anémie, un taux bas oriente vers un défaut de fabrication plutôt que vers une perte de sang.",
  },

  // ────────────────────────────── Fer et réserves ─────────────────────────────
  {
    key: "ferritine",
    label: "Ferritine",
    aliases: ["ferritine", "ferritinemie"],
    category: "fer",
    unit: "µg/L",
    ranges: [
      { sex: "F", unit: "µg/L", low: 15, high: 150 },
      { sex: "M", unit: "µg/L", low: 30, high: 300 },
      { sex: "F", unit: "ng/mL", low: 15, high: 150 },
      { sex: "M", unit: "ng/mL", low: 30, high: 300 },
    ],
    about:
      "La ferritine est la protéine de stockage du fer : elle reflète les réserves de l'organisme, pas le fer circulant du moment. C'est le meilleur indicateur d'une carence en fer.",
    high:
      "Attention, c'est aussi une protéine de l'inflammation : elle monte lors de toute inflammation, infection, consommation d'alcool, surpoids ou souffrance du foie, sans que les réserves de fer soient réellement excessives. Une vraie surcharge en fer se confirme avec le coefficient de saturation de la transferrine.",
    low:
      "Une ferritine basse signe un épuisement des réserves de fer, avant même que l'hémoglobine ne baisse. Chez la femme, les règles abondantes en sont la première cause ; sinon, apports insuffisants, mauvaise absorption ou saignements digestifs.",
  },
  {
    key: "fer_serique",
    label: "Fer sérique",
    aliases: ["fer serique", "fer", "sideremie", "fer serum"],
    category: "fer",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", low: 10, high: 30 }],
    about:
      "Le fer sérique mesure le fer qui circule à l'instant du prélèvement. Il varie fortement d'une heure à l'autre et selon le dernier repas : seul, il ne permet pas de conclure.",
    high:
      "Une valeur élevée peut suivre une supplémentation en fer récente, une consommation d'alcool, ou évoquer une surcharge en fer si le coefficient de saturation est lui aussi élevé.",
    low:
      "Une valeur basse évoque un manque de fer ou une inflammation qui le séquestre ; la ferritine permet de trancher entre les deux.",
  },
  {
    key: "transferrine",
    label: "Transferrine",
    aliases: ["transferrine", "siderophiline"],
    category: "fer",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 2.0, high: 3.6 }],
    about:
      "La transferrine est le transporteur du fer dans le sang. L'organisme en fabrique davantage quand il manque de fer, comme on ajouterait des camions pour une cargaison rare.",
    high:
      "Une transferrine élevée est le signe classique d'un manque de fer : le corps augmente sa capacité de transport. Elle monte aussi sous œstrogènes et pendant la grossesse.",
    low:
      "Une transferrine basse s'observe lors d'une inflammation, d'une dénutrition, d'une maladie du foie ou d'une surcharge en fer.",
  },
  {
    key: "cst",
    label: "Coefficient de saturation de la transferrine",
    aliases: ["coefficient de saturation de la transferrine", "coefficient de saturation", "cst", "saturation de la transferrine", "cs transferrine"],
    category: "fer",
    unit: "%",
    ranges: [{ unit: "%", low: 20, high: 40 }],
    about:
      "Ce coefficient indique quel pourcentage des transporteurs de fer est effectivement chargé. C'est l'examen clé pour distinguer une carence d'une surcharge en fer.",
    high:
      "Une saturation élevée, surtout au-delà de 45 %, est le principal signal d'alerte d'une surcharge en fer d'origine génétique (hémochromatose) et mérite un avis médical.",
    low: "Une saturation basse traduit un manque de fer disponible, par carence ou par inflammation.",
  },
  {
    key: "capacite_fixation",
    label: "Capacité totale de fixation du fer",
    aliases: ["capacite totale de fixation", "capacite de fixation du fer", "ctf", "tibc", "capacite totale de fixation du fer"],
    category: "fer",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", low: 45, high: 80 }],
    about:
      "Cette capacité mesure la quantité totale de fer que le sang pourrait transporter s'il était saturé. Elle évolue comme la transferrine.",
    high: "Une capacité élevée accompagne le manque de fer : l'organisme se prépare à en capter davantage.",
    low: "Une capacité basse s'observe en cas d'inflammation, de dénutrition ou de surcharge en fer.",
  },

  // ───────────────────────────────── Reins ───────────────────────────────────
  {
    key: "creatinine",
    label: "Créatinine",
    aliases: ["creatinine", "creatininemie", "creatinine serique"],
    category: "renal",
    unit: "µmol/L",
    ranges: [
      { sex: "F", unit: "µmol/L", low: 45, high: 84 },
      { sex: "M", unit: "µmol/L", low: 59, high: 104 },
      { sex: "F", unit: "mg/L", low: 5.1, high: 9.5 },
      { sex: "M", unit: "mg/L", low: 6.7, high: 11.8 },
    ],
    about:
      "La créatinine est un déchet produit en continu par les muscles et éliminé par les reins. Son taux dans le sang sert à estimer le bon fonctionnement du filtre rénal. Elle dépend aussi de la masse musculaire.",
    high:
      "Une créatinine élevée évoque un filtrage rénal moins efficace, une déshydratation, une masse musculaire importante, un effort intense récent ou une consommation de viande abondante la veille. Le DFG estimé est plus parlant que la valeur brute.",
    low:
      "Une créatinine basse s'observe chez les personnes de faible masse musculaire, pendant la grossesse ou en cas de dénutrition ; elle est rarement préoccupante.",
  },
  {
    key: "dfg",
    label: "DFG estimé (débit de filtration glomérulaire)",
    aliases: ["debit de filtration glomerulaire", "dfg", "dfge", "estimation du dfg", "clairance", "ckd-epi", "mdrd", "egfr"],
    category: "renal",
    unit: "mL/min/1,73m²",
    ranges: [{ unit: "mL/min/1,73m²", low: 90 }],
    about:
      "Le DFG estime le volume de sang que les reins filtrent chaque minute. C'est l'indicateur de référence de la fonction rénale, calculé à partir de la créatinine, de l'âge et du sexe.",
    high:
      "Un DFG élevé n'est pas inquiétant : il traduit une filtration rapide, parfois liée à la grossesse ou à une faible masse musculaire.",
    low:
      "Entre 60 et 90, la filtration est considérée comme légèrement diminuée, ce qui est fréquent et souvent sans conséquence. En dessous de 60 de façon durable, on parle d'insuffisance rénale et un suivi médical s'impose.",
  },
  {
    key: "uree",
    label: "Urée",
    aliases: ["uree", "uree sanguine", "azote ureique", "uremie"],
    category: "renal",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 2.5, high: 7.5 }, { unit: "g/L", low: 0.15, high: 0.45 }],
    about:
      "L'urée est le déchet issu de la dégradation des protéines, éliminé par les reins. Elle dépend beaucoup de l'alimentation et de l'hydratation.",
    high:
      "Une urée élevée évoque avant tout une déshydratation ou une alimentation très riche en protéines ; associée à une créatinine élevée, elle oriente vers les reins.",
    low:
      "Une urée basse s'observe en cas d'alimentation pauvre en protéines, de grossesse, d'hydratation abondante ou de maladie du foie.",
  },
  {
    key: "acide_urique",
    label: "Acide urique",
    aliases: ["acide urique", "uricemie", "urate"],
    category: "renal",
    unit: "µmol/L",
    ranges: [
      { sex: "F", unit: "µmol/L", low: 150, high: 350 },
      { sex: "M", unit: "µmol/L", low: 200, high: 420 },
    ],
    about:
      "L'acide urique provient de la dégradation des purines, présentes dans certains aliments et dans nos propres cellules. En excès, il peut cristalliser dans les articulations.",
    high:
      "Une valeur élevée est favorisée par l'alcool (bière en particulier), les viandes rouges, les abats, les sodas sucrés, le surpoids, certains diurétiques ; c'est le terrain de la crise de goutte.",
    low: "Une valeur basse est généralement sans conséquence ; elle peut suivre certains traitements ou une alimentation pauvre en protéines.",
  },

  // ──────────────────────────────── Foie ────────────────────────────────────
  {
    key: "asat",
    label: "ASAT (TGO)",
    aliases: ["asat", "tgo", "aspartate aminotransferase", "asat tgo", "got", "transaminase asat"],
    category: "hepatique",
    unit: "UI/L",
    ranges: [
      { sex: "F", unit: "UI/L", low: 5, high: 35 },
      { sex: "M", unit: "UI/L", low: 5, high: 40 },
    ],
    about:
      "L'ASAT est une enzyme présente dans le foie mais aussi dans les muscles et le cœur. Elle se libère dans le sang quand ces cellules souffrent.",
    high:
      "Une élévation peut venir du foie (alcool, surcharge en graisse, virus, médicaments) mais aussi tout simplement d'un effort physique intense dans les jours précédant la prise de sang.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "alat",
    label: "ALAT (TGP)",
    aliases: ["alat", "tgp", "alanine aminotransferase", "alat tgp", "gpt", "transaminase alat"],
    category: "hepatique",
    unit: "UI/L",
    ranges: [
      { sex: "F", unit: "UI/L", low: 5, high: 33 },
      { sex: "M", unit: "UI/L", low: 5, high: 41 },
    ],
    about:
      "L'ALAT est l'enzyme la plus spécifique du foie : contrairement à l'ASAT, elle vient presque uniquement des cellules hépatiques.",
    high:
      "Une élévation traduit une souffrance du foie : excès de graisse hépatique (souvent liée au surpoids ou au syndrome métabolique), alcool, médicaments, hépatite virale. Une hausse modérée et isolée se recontrôle à distance.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "ggt",
    label: "Gamma-GT",
    aliases: ["gamma gt", "ggt", "gamma-gt", "gammagt", "gamma glutamyl transferase", "y-gt"],
    category: "hepatique",
    unit: "UI/L",
    ranges: [
      { sex: "F", unit: "UI/L", low: 6, high: 42 },
      { sex: "M", unit: "UI/L", low: 10, high: 71 },
    ],
    about:
      "La gamma-GT est une enzyme du foie et des voies biliaires. Très sensible, elle réagit à de nombreuses sollicitations du foie — ce qui la rend peu spécifique.",
    high:
      "Une élévation isolée est fréquente et souvent bénigne : alcool même modéré, excès de graisse dans le foie, surpoids, nombreux médicaments courants. Associée aux phosphatases alcalines, elle oriente vers les voies biliaires.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "pal",
    label: "Phosphatases alcalines",
    aliases: ["phosphatases alcalines", "pal", "phosphatase alcaline", "alp"],
    category: "hepatique",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", low: 35, high: 105 }],
    about:
      "Les phosphatases alcalines proviennent surtout du foie et des os. Elles renseignent donc autant sur les voies biliaires que sur le remodelage osseux.",
    high:
      "Une élévation évoque un obstacle ou une irritation des voies biliaires si la gamma-GT monte aussi ; sinon une origine osseuse, une croissance, une grossesse, ou un manque de vitamine D.",
    low: "Une valeur basse peut accompagner une dénutrition, une thyroïde ralentie ou un déficit en zinc ; elle est rarement significative.",
  },
  {
    key: "bilirubine_totale",
    label: "Bilirubine totale",
    aliases: ["bilirubine totale", "bilirubine", "bilirubinemie totale"],
    category: "hepatique",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", low: 3, high: 17 }],
    about:
      "La bilirubine provient du recyclage des globules rouges usagés ; le foie la transforme puis l'élimine dans la bile. En excès, elle donne le teint jaune.",
    high:
      "Une élévation modérée et isolée correspond très souvent au syndrome de Gilbert, une particularité génétique bénigne qui touche une personne sur dix et s'accentue lors du jeûne, du stress ou d'une infection. Sinon, elle oriente vers le foie, les voies biliaires ou une destruction accrue de globules rouges.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "bilirubine_conjuguee",
    label: "Bilirubine conjuguée",
    aliases: ["bilirubine conjuguee", "bilirubine directe"],
    category: "hepatique",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", high: 5 }],
    about:
      "C'est la fraction de bilirubine déjà transformée par le foie et prête à être éliminée. Elle permet de situer l'origine d'une bilirubine totale élevée.",
    high:
      "Une élévation de cette fraction oriente vers un obstacle sur les voies biliaires ou une atteinte du foie, et mérite un avis médical.",
    low: "Une valeur basse est normale et attendue.",
  },
  {
    key: "albumine",
    label: "Albumine",
    aliases: ["albumine", "albuminemie"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 35, high: 50 }],
    about:
      "L'albumine est la principale protéine du sang, fabriquée par le foie. Elle maintient l'eau dans les vaisseaux et transporte de nombreuses substances. C'est un bon reflet de l'état nutritionnel.",
    high: "Une valeur élevée traduit presque toujours une simple déshydratation.",
    low:
      "Une valeur basse peut refléter une dénutrition, une inflammation prolongée, une maladie du foie ou une fuite rénale ou digestive de protéines.",
  },
  {
    key: "proteines_totales",
    label: "Protéines totales",
    aliases: ["proteines totales", "protidemie", "proteine totale", "protides totaux"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 60, high: 80 }],
    about:
      "Cette mesure additionne l'albumine et toutes les autres protéines circulantes, dont les anticorps. Elle donne une vue d'ensemble de l'équilibre protéique.",
    high: "Une valeur élevée évoque une déshydratation ou une production accrue d'anticorps lors d'une inflammation chronique.",
    low: "Une valeur basse accompagne une dénutrition, une maladie du foie, ou une perte de protéines par les reins ou l'intestin.",
  },
  {
    key: "alpha_1_globulines",
    label: "Alpha 1 globulines",
    aliases: ["alpha 1 globulines", "alpha 1 globuline", "alpha1 globulines"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 2.1, high: 3.5 }],
    about:
      "C'est l'une des fractions révélées par l'électrophorèse, la technique qui sépare les protéines du sang par familles. Celle-ci regroupe surtout des protéines de l'inflammation, dont l'alpha-1-antitrypsine.",
    high: "Une élévation accompagne une inflammation, aiguë ou installée depuis longtemps.",
    low:
      "Une valeur basse est rare et peut évoquer un déficit héréditaire en alpha-1-antitrypsine, qui concerne le poumon et le foie ; elle justifie un avis médical.",
  },
  {
    key: "alpha_2_globulines",
    label: "Alpha 2 globulines",
    aliases: ["alpha 2 globulines", "alpha 2 globuline", "alpha2 globulines"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 5.1, high: 8.5 }],
    about:
      "Cette fraction de l'électrophorèse contient l'haptoglobine, qui récupère l'hémoglobine libérée par les globules rouges usagés, et la céruloplasmine, transporteuse du cuivre.",
    high:
      "Une élévation accompagne une inflammation, ou une fuite de protéines par les reins qui laisse ces grosses molécules derrière elle.",
    low:
      "Une valeur basse s'observe quand les globules rouges sont détruits plus vite que la normale — l'haptoglobine est alors consommée — ou lors d'une atteinte du foie.",
  },
  {
    key: "beta_1_globulines",
    label: "Beta 1 globulines",
    aliases: ["beta 1 globulines", "beta 1 globuline", "beta1 globulines"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 3.4, high: 5.2 }],
    about:
      "Cette fraction est portée en grande partie par la transferrine, le transporteur du fer dans le sang. Elle suit donc souvent le statut en fer.",
    high:
      "Une élévation accompagne fréquemment un manque de fer, l'organisme fabriquant davantage de transporteurs ; elle monte aussi sous œstrogènes et pendant la grossesse.",
    low: "Une valeur basse s'observe lors d'une inflammation, d'une dénutrition ou d'une maladie du foie.",
  },
  {
    key: "beta_2_globulines",
    label: "Beta 2 globulines",
    aliases: ["beta 2 globulines", "beta 2 globuline", "beta2 globulines"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 2.3, high: 4.7 }],
    about:
      "Cette fraction comprend notamment le complément C3, un ensemble de protéines qui épaulent les anticorps dans la défense contre les microbes.",
    high: "Une élévation accompagne une inflammation ou une infection.",
    low:
      "Une valeur basse peut traduire une consommation du complément au cours de certaines maladies immunitaires ; elle s'interprète avec le reste du tracé.",
  },
  {
    key: "gamma_globulines",
    label: "Gamma globulines",
    aliases: ["gamma globulines", "gamma globuline", "gammaglobulines"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 8.0, high: 13.5 }],
    about:
      "Les gamma globulines sont les anticorps : la mémoire immunitaire, fabriquée au fil des infections et des vaccinations. C'est la fraction la plus parlante de l'électrophorèse.",
    high:
      "Une élévation régulière de toute la fraction accompagne une stimulation immunitaire prolongée, une infection installée ou une maladie du foie. Un pic étroit et isolé sur le tracé a une autre signification et demande toujours un avis médical.",
    low:
      "Une valeur basse traduit des défenses diminuées : perte de protéines par les reins ou l'intestin, certains traitements immunosuppresseurs, plus rarement un déficit immunitaire.",
  },
  {
    key: "rapport_albumine_globulines",
    label: "Rapport albumine / globulines",
    aliases: ["rapport albumine globulines", "rapport albumine sur globulines", "rapport a g"],
    category: "proteines",
    unit: "",
    ranges: [{ unit: "", low: 1.2, high: 1.8 }],
    about:
      "Ce rapport compare l'albumine à l'ensemble des autres protéines du sang. Il résume d'un seul chiffre l'équilibre général du tracé d'électrophorèse.",
    high:
      "Un rapport élevé traduit une albumine proportionnellement abondante, le plus souvent par simple déshydratation.",
    low:
      "Un rapport abaissé signale soit une albumine qui baisse, soit des globulines qui montent : inflammation prolongée, maladie du foie ou dénutrition. Il invite à regarder le détail des fractions.",
  },
  {
    key: "immunoglobulines_a",
    label: "Immunoglobulines A (IgA)",
    aliases: ["immunoglobulines a", "immunoglobuline a", "ig a", "iga"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 0.7, high: 4.0 }],
    about:
      "Les immunoglobulines A sont les anticorps qui protègent les muqueuses — nez, bronches, intestin — là où l'organisme rencontre le plus de microbes. Elles constituent la première ligne de défense, avant même que le reste du système immunitaire n'intervienne.",
    high:
      "Une élévation accompagne des infections répétées des muqueuses, une inflammation chronique de l'intestin, ou une atteinte du foie, notamment en cas de consommation d'alcool régulière.",
    low:
      "Le déficit en IgA est le déficit immunitaire le plus fréquent, et il passe le plus souvent totalement inaperçu. Il peut aussi se traduire par des infections ORL et digestives à répétition, et s'associe parfois à une intolérance au gluten.",
  },
  {
    key: "immunoglobulines_g",
    label: "Immunoglobulines G (IgG)",
    aliases: ["immunoglobulines g", "immunoglobuline g", "ig g", "igg"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 7.0, high: 16.0 }],
    about:
      "Les immunoglobulines G sont les anticorps les plus nombreux et les plus durables : ce sont eux qui gardent la mémoire des infections passées et des vaccins. Ce sont aussi les seuls à traverser le placenta, protégeant le nouveau-né ses premiers mois.",
    high:
      "Une élévation d'ensemble traduit une stimulation immunitaire prolongée : infection installée, maladie inflammatoire, atteinte du foie. Une hausse importante et isolée demande un avis médical.",
    low:
      "Un taux bas signale des défenses affaiblies, soit par production insuffisante, soit par perte de protéines via les reins ou l'intestin. Il favorise les infections à répétition.",
  },
  {
    key: "immunoglobulines_m",
    label: "Immunoglobulines M (IgM)",
    aliases: ["immunoglobulines m", "immunoglobuline m", "ig m", "igm"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 0.4, high: 2.3 }],
    about:
      "Les immunoglobulines M sont les premiers anticorps fabriqués face à un microbe encore inconnu. Leur présence oriente vers une rencontre récente, là où les IgG signent une immunité plus ancienne.",
    high:
      "Une élévation évoque une infection récente ou en cours ; plus rarement, une maladie du foie ou une production anormale par un groupe de cellules, qui justifie alors un avis.",
    low:
      "Un taux bas accompagne un déficit immunitaire ou une perte de protéines. Isolé et modéré, il est le plus souvent sans conséquence.",
  },

  // ────────────────────── Cholestérol et graisses ────────────────────────────
  {
    key: "cholesterol_total",
    label: "Cholestérol total",
    aliases: ["cholesterol total", "cholesterol", "cholesterolemie totale"],
    category: "lipides",
    unit: "g/L",
    ranges: [{ unit: "g/L", high: 2.0 }, { unit: "mmol/L", high: 5.2 }],
    about:
      "Le cholestérol total additionne toutes les formes de cholestérol circulant. Pris seul il renseigne peu : c'est la répartition entre HDL et LDL qui compte vraiment.",
    high:
      "Une valeur élevée s'interprète toujours avec le HDL et le LDL : un total élevé porté par un HDL abondant n'a pas la même portée qu'un total élevé porté par le LDL.",
    low: "Une valeur basse est généralement favorable ; très basse, elle peut accompagner une dénutrition ou une thyroïde accélérée.",
  },
  {
    key: "hdl",
    label: "Cholestérol HDL",
    aliases: ["hdl", "cholesterol hdl", "hdl cholesterol", "c-hdl"],
    category: "lipides",
    unit: "g/L",
    ranges: [
      { sex: "F", unit: "g/L", low: 0.5 },
      { sex: "M", unit: "g/L", low: 0.4 },
    ],
    about:
      "Le HDL est le « bon » cholestérol : il ramène l'excès de cholestérol des artères vers le foie pour élimination. Plus il est haut, mieux c'est.",
    high: "Un HDL élevé est un facteur protecteur pour les artères — une bonne nouvelle.",
    low:
      "Un HDL bas réduit cette protection. Il est favorisé par la sédentarité, le tabac, le surpoids et un excès de sucres rapides ; l'activité physique régulière est le levier le plus efficace pour le remonter.",
  },
  {
    key: "ldl",
    label: "Cholestérol LDL",
    aliases: ["ldl", "cholesterol ldl", "ldl cholesterol", "c-ldl"],
    category: "lipides",
    unit: "g/L",
    ranges: [{ unit: "g/L", high: 1.6 }, { unit: "mmol/L", high: 4.1 }],
    about:
      "Le LDL est le « mauvais » cholestérol : en excès, il se dépose sur la paroi des artères. Son seuil souhaitable n'est pas universel — il dépend du risque cardiovasculaire de chacun.",
    high:
      "Un LDL élevé augmente le risque de dépôts artériels sur le long terme. Le seuil à viser est fixé par le médecin selon l'âge, la tension, le tabac, le diabète et les antécédents familiaux.",
    low: "Un LDL bas est favorable pour les artères.",
  },
  {
    key: "triglycerides",
    label: "Triglycérides",
    aliases: ["triglycerides", "triglyceride", "tg", "triglyceridemie"],
    category: "lipides",
    unit: "g/L",
    ranges: [{ unit: "g/L", high: 1.5 }, { unit: "mmol/L", high: 1.7 }],
    about:
      "Les triglycérides sont la forme de stockage des graisses circulantes. Ils sont très sensibles à ce qu'on a mangé et bu les jours précédents.",
    high:
      "Une élévation est favorisée par les sucres rapides, l'alcool, le surpoids et un prélèvement non à jeun. Elle accompagne souvent un HDL bas dans le syndrome métabolique.",
    low:
      "Des triglycérides bas ne posent pas de problème et n'appellent aucune correction ; c'est même un profil favorable pour les artères.",
  },
  {
    key: "cholesterol_non_hdl",
    label: "Cholestérol non-HDL",
    aliases: ["cholesterol non hdl", "non hdl", "c non hdl", "cholesterol non hdl calcule"],
    category: "lipides",
    unit: "g/L",
    ranges: [{ unit: "g/L", high: 1.5 }, { unit: "mmol/L", high: 3.88 }],
    about:
      "Le cholestérol non-HDL rassemble toutes les fractions qui se déposent sur les artères : c'est le cholestérol total moins le « bon ». Quand les triglycérides sont élevés, il reflète le risque mieux que le LDL seul.",
    high:
      "Une valeur au-dessus de la cible générale invite à regarder l'ensemble du bilan lipidique. Comme pour le LDL, le seuil à viser n'est pas universel : il dépend du risque cardiovasculaire global, que le médecin apprécie.",
    low: "Une valeur basse est favorable pour les artères.",
  },

  // ───────────────────────── Sucre dans le sang ──────────────────────────────
  {
    key: "glycemie",
    label: "Glycémie à jeun",
    aliases: ["glycemie a jeun", "glycemie", "glucose", "glucose a jeun", "glycemie veineuse"],
    category: "glycemie",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 0.7, high: 1.1 }, { unit: "mmol/L", low: 3.9, high: 6.1 }],
    about:
      "La glycémie à jeun mesure le sucre circulant après au moins huit heures sans manger. C'est l'examen de dépistage du diabète.",
    high:
      "Entre 1,10 et 1,26 g/L on parle d'hyperglycémie modérée à jeun, un signal d'alerte réversible par l'alimentation et l'activité physique. Au-delà de 1,26 g/L à deux reprises, le diagnostic de diabète est posé par le médecin.",
    low:
      "Une valeur basse peut venir d'un jeûne prolongé, de l'alcool, d'un traitement antidiabétique ; accompagnée de malaises, elle mérite un avis.",
  },
  {
    key: "hba1c",
    label: "Hémoglobine glyquée (HbA1c)",
    aliases: ["hemoglobine glyquee", "hba1c", "hb a1c", "hemoglobine glycosylee", "a1c"],
    category: "glycemie",
    unit: "%",
    ranges: [{ unit: "%", high: 5.7 }],
    about:
      "L'HbA1c reflète la glycémie moyenne des deux à trois derniers mois : c'est la mémoire du sucre, insensible à ce qu'on a mangé la veille.",
    high:
      "Entre 5,7 et 6,4 % on parle de prédiabète, une zone où l'hygiène de vie peut inverser la tendance. À partir de 6,5 %, le seuil du diabète est atteint.",
    low: "Une valeur basse peut être faussée par une anémie ou un renouvellement rapide des globules rouges.",
  },
  {
    key: "insuline",
    label: "Insuline",
    aliases: ["insuline", "insulinemie", "insuline a jeun"],
    category: "glycemie",
    unit: "mUI/L",
    ranges: [{ unit: "mUI/L", low: 2, high: 25 }],
    about:
      "L'insuline est l'hormone qui fait entrer le sucre dans les cellules. Mesurée à jeun avec la glycémie, elle renseigne sur la résistance à l'insuline.",
    high:
      "Une insuline élevée avec une glycémie encore normale traduit une résistance à l'insuline : le corps doit produire davantage pour obtenir le même effet. C'est un stade précoce et réversible.",
    low: "Une valeur basse accompagne un jeûne prolongé ou une production pancréatique insuffisante.",
  },

  // ──────────────────────────────── Thyroïde ─────────────────────────────────
  {
    key: "tsh",
    label: "TSH",
    aliases: ["tsh", "tsh us", "thyreostimuline", "tsh ultrasensible", "hormone thyreostimulante"],
    category: "thyroide",
    unit: "mUI/L",
    ranges: [{ unit: "mUI/L", low: 0.4, high: 4.0 }],
    about:
      "La TSH est l'hormone par laquelle le cerveau commande la thyroïde. Elle fonctionne à l'envers de l'intuition : quand la thyroïde ralentit, le cerveau insiste et la TSH monte.",
    high:
      "Une TSH élevée oriente vers une thyroïde qui tourne au ralenti (hypothyroïdie) : fatigue, frilosité, prise de poids, constipation. Elle se confirme avec la T4 libre.",
    low:
      "Une TSH basse oriente vers une thyroïde trop active (hyperthyroïdie) : palpitations, nervosité, amaigrissement, bouffées de chaleur.",
  },
  {
    key: "t4l",
    label: "T4 libre",
    aliases: ["t4 libre", "t4l", "ft4", "thyroxine libre", "tetraiodothyronine libre"],
    category: "thyroide",
    unit: "pmol/L",
    ranges: [{ unit: "pmol/L", low: 9, high: 19 }],
    about:
      "La T4 libre est l'hormone produite par la thyroïde elle-même, dans sa forme active disponible. Elle confirme ce que la TSH suggère.",
    high: "Une T4 libre élevée confirme une thyroïde trop active.",
    low: "Une T4 libre basse confirme une thyroïde insuffisante.",
  },
  {
    key: "t3l",
    label: "T3 libre",
    aliases: ["t3 libre", "t3l", "ft3", "triiodothyronine libre"],
    category: "thyroide",
    unit: "pmol/L",
    ranges: [{ unit: "pmol/L", low: 3.5, high: 6.5 }],
    about:
      "La T3 libre est la forme la plus active des hormones thyroïdiennes, issue en grande partie de la transformation de la T4 dans les tissus.",
    high: "Une T3 libre élevée accompagne une hyperthyroïdie.",
    low: "Une T3 libre basse s'observe en hypothyroïdie, mais aussi lors d'une maladie aiguë sans que la thyroïde soit en cause.",
  },
  {
    key: "anti_tpo",
    label: "Anticorps anti-TPO",
    aliases: ["anticorps anti tpo", "anti tpo", "anti-tpo", "ac anti tpo", "anticorps antithyroperoxydase"],
    category: "thyroide",
    unit: "UI/mL",
    ranges: [{ unit: "UI/mL", high: 34 }],
    about:
      "Ces anticorps sont dirigés contre une enzyme de la thyroïde. Leur présence signe une origine auto-immune à un dérèglement thyroïdien.",
    high:
      "Un taux élevé oriente vers une thyroïdite auto-immune (maladie de Hashimoto), cause la plus fréquente d'hypothyroïdie. Il justifie une surveillance régulière de la TSH.",
    low: "Un taux bas ou indétectable est le résultat attendu.",
  },

  // ─────────────────────────────── Inflammation ──────────────────────────────
  {
    key: "crp",
    label: "CRP (protéine C réactive)",
    aliases: ["crp", "proteine c reactive", "c reactive protein", "crp ultrasensible", "crp us"],
    category: "inflammation",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", high: 5 }],
    about:
      "La CRP est le marqueur d'inflammation le plus réactif : elle monte en quelques heures et redescend aussi vite. Elle dit qu'il y a une inflammation, jamais où ni pourquoi.",
    high:
      "Une élévation modérée accompagne une infection banale, une blessure, une poussée inflammatoire ou un surpoids. Une élévation franche évoque une infection bactérienne active et demande un avis rapide.",
    low: "Une CRP basse est le résultat attendu : pas d'inflammation détectable au moment du prélèvement.",
  },
  {
    key: "vs",
    label: "Vitesse de sédimentation",
    aliases: ["vitesse de sedimentation", "vs", "vs 1ere heure", "sedimentation"],
    category: "inflammation",
    unit: "mm",
    ranges: [
      { sex: "F", unit: "mm", high: 20 },
      { sex: "M", unit: "mm", high: 15 },
    ],
    about:
      "La VS mesure la vitesse à laquelle les globules rouges se déposent dans un tube. Plus lente à bouger que la CRP, elle reflète une inflammation installée.",
    high:
      "Une VS élevée accompagne une inflammation chronique, une infection, une anémie, une grossesse, ou simplement l'âge — elle augmente naturellement avec les années.",
    low: "Une VS basse n'a pas de signification clinique.",
  },
  {
    key: "fibrinogene",
    label: "Fibrinogène",
    aliases: ["fibrinogene", "fibrinogenemie"],
    category: "coagulation",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 2, high: 4 }],
    about:
      "Le fibrinogène est à la fois une protéine de la coagulation et un marqueur d'inflammation.",
    high: "Une élévation accompagne une inflammation, une infection, une grossesse ou le tabagisme.",
    low: "Une valeur basse peut traduire une maladie du foie ou une consommation excessive lors d'un trouble de la coagulation.",
  },

  // ──────────────────────────────── Vitamines ────────────────────────────────
  {
    key: "vitamine_d",
    label: "Vitamine D (25-OH)",
    aliases: ["vitamine d", "25 oh vitamine d", "25-oh-vitamine d", "vitamine d3", "25 hydroxyvitamine d", "calcidiol"],
    category: "vitamines",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", low: 30, high: 70 }, { unit: "nmol/L", low: 75, high: 175 }],
    about:
      "La vitamine D est fabriquée par la peau sous l'effet du soleil et complétée par l'alimentation. Elle est indispensable à la fixation du calcium sur les os et participe à l'immunité.",
    high:
      "Une valeur élevée résulte presque toujours d'une supplémentation trop dosée ; un excès prolongé peut faire monter le calcium.",
    low:
      "Le déficit est extrêmement fréquent en France, surtout d'octobre à avril, et se manifeste par fatigue, douleurs musculaires diffuses et fragilité osseuse. Il se corrige facilement par supplémentation.",
  },
  {
    key: "vitamine_b12",
    label: "Vitamine B12",
    aliases: ["vitamine b12", "b12", "cobalamine", "vit b12"],
    category: "vitamines",
    unit: "pg/mL",
    ranges: [{ unit: "pg/mL", low: 200, high: 900 }, { unit: "pmol/L", low: 148, high: 664 }],
    about:
      "La vitamine B12 est essentielle à la fabrication des globules rouges et au bon fonctionnement des nerfs. Elle vient exclusivement des produits d'origine animale.",
    high:
      "Une valeur élevée provient le plus souvent d'une supplémentation ; sans supplémentation, une élévation marquée mérite un avis médical.",
    low:
      "Une carence est fréquente en alimentation végétarienne ou végétalienne, après 60 ans, sous certains traitements de l'estomac, ou en cas de mauvaise absorption. Elle donne une anémie à gros globules rouges et parfois des fourmillements.",
  },
  {
    key: "folates",
    label: "Folates (vitamine B9)",
    aliases: ["folates", "vitamine b9", "acide folique", "b9", "folate serique"],
    category: "vitamines",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", low: 3, high: 17 }],
    about:
      "Les folates participent à la fabrication des globules rouges et à la formation du système nerveux de l'embryon — d'où leur supplémentation systématique avant et pendant le début de grossesse.",
    high: "Une valeur élevée est liée à une supplémentation et sans danger.",
    low:
      "Une carence s'observe en cas d'alimentation pauvre en légumes verts, de consommation d'alcool régulière, de grossesse ou de mauvaise absorption. Elle donne une anémie à gros globules rouges.",
  },

  // ────────────────────────────── Sels minéraux ──────────────────────────────
  {
    key: "sodium",
    label: "Sodium (natrémie)",
    aliases: ["sodium", "natremie", "na", "na+"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 135, high: 145 }],
    about:
      "Le sodium règle la quantité d'eau retenue dans l'organisme. Sa valeur renseigne davantage sur l'équilibre en eau que sur la consommation de sel.",
    high: "Une valeur élevée traduit un manque d'eau plus qu'un excès de sel : déshydratation, apports en boisson insuffisants.",
    low:
      "Une valeur basse est le trouble le plus fréquent : boissons très abondantes, certains diurétiques ou antidépresseurs, insuffisance cardiaque. Une baisse marquée peut donner nausées et confusion.",
  },
  {
    key: "potassium",
    label: "Potassium (kaliémie)",
    aliases: ["potassium", "kaliemie", "k", "k+"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 3.5, high: 5.1 }],
    about:
      "Le potassium est indispensable au fonctionnement des muscles et surtout du cœur. C'est le sel minéral dont l'équilibre est le plus étroitement surveillé.",
    high:
      "Une valeur élevée est souvent un artefact : garrot serré, hémolyse du tube pendant le transport. Réelle, elle peut venir des reins ou de certains médicaments et demande un contrôle rapide.",
    low:
      "Une valeur basse s'observe avec les vomissements, les diarrhées, les diurétiques ou les laxatifs ; elle peut donner crampes et fatigue musculaire.",
  },
  {
    key: "chlore",
    label: "Chlore (chlorémie)",
    aliases: ["chlore", "chloremie", "cl", "cl-", "chlorures"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 98, high: 107 }],
    about:
      "Le chlore accompagne le sodium dans l'équilibre en eau et participe à l'équilibre acido-basique du sang.",
    high: "Une valeur élevée accompagne une déshydratation ou certains déséquilibres acido-basiques.",
    low: "Une valeur basse suit des vomissements répétés ou l'usage de diurétiques.",
  },
  {
    key: "calcium",
    label: "Calcium (calcémie)",
    aliases: ["calcium", "calcemie", "ca", "ca++", "calcium total"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 2.2, high: 2.6 }],
    about:
      "Le calcium sanguin est maintenu dans une fourchette très étroite par les parathyroïdes et la vitamine D. Il ne reflète pas directement le calcium des os.",
    high:
      "Une valeur élevée mérite toujours un avis médical : elle oriente vers les glandes parathyroïdes ou un excès de vitamine D.",
    low:
      "Une valeur basse accompagne souvent un déficit en vitamine D ; elle doit être interprétée en tenant compte de l'albumine, qui transporte le calcium.",
  },
  {
    key: "phosphore",
    label: "Phosphore (phosphorémie)",
    aliases: ["phosphore", "phosphoremie", "phosphates", "p"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 0.8, high: 1.5 }],
    about:
      "Le phosphore travaille en tandem avec le calcium pour la solidité des os et sert de carburant cellulaire.",
    high: "Une valeur élevée s'observe surtout en cas de fonction rénale diminuée.",
    low: "Une valeur basse peut accompagner un déficit en vitamine D, une dénutrition ou une consommation d'alcool régulière.",
  },
  {
    key: "bicarbonates",
    label: "Bicarbonates (réserve alcaline)",
    aliases: ["bicarbonates", "reserve alcaline", "hco3", "co2 total", "bicarbonate"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 22, high: 29 }],
    about:
      "Les bicarbonates tamponnent l'acidité du sang et maintiennent son pH dans une fourchette très étroite.",
    high: "Une valeur élevée suit des vomissements répétés ou l'usage de diurétiques.",
    low: "Une valeur basse traduit une acidité excessive : diarrhée, fonction rénale diminuée, diabète déséquilibré.",
  },
  {
    key: "magnesium",
    label: "Magnésium",
    aliases: ["magnesium", "magnesemie", "mg", "mg++"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 0.7, high: 1.0 }],
    about:
      "Le magnésium intervient dans des centaines de réactions, notamment la contraction musculaire et la transmission nerveuse. Le sang n'en contient qu'une petite part : un dosage normal n'exclut pas un déficit tissulaire.",
    high: "Une valeur élevée est rare, essentiellement liée à une supplémentation forte ou à une fonction rénale diminuée.",
    low:
      "Une valeur basse s'observe avec l'alcool, les diurétiques, les diarrhées prolongées ou une alimentation pauvre ; elle donne crampes, paupière qui saute et fatigue.",
  },

  // ─────────────────────────── Autres marqueurs ──────────────────────────────
  {
    key: "cpk",
    label: "CPK (créatine phosphokinase)",
    aliases: ["cpk", "creatine phosphokinase", "ck", "creatine kinase"],
    category: "autres",
    unit: "UI/L",
    ranges: [
      { sex: "F", unit: "UI/L", low: 26, high: 192 },
      { sex: "M", unit: "UI/L", low: 39, high: 308 },
    ],
    about:
      "Les CPK sont des enzymes musculaires libérées quand les muscles travaillent fort ou souffrent.",
    high:
      "Une élévation suit très souvent un effort physique intense dans les jours précédents, une injection intramusculaire, ou certains médicaments dont les statines. Une hausse importante avec douleurs musculaires demande un avis.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "ldh",
    label: "LDH (lactate déshydrogénase)",
    aliases: ["ldh", "lactate deshydrogenase", "lacticodeshydrogenase"],
    category: "autres",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", low: 125, high: 243 }],
    about:
      "La LDH est présente dans presque toutes les cellules ; elle se libère dès qu'une cellule est abîmée. Très sensible, très peu spécifique.",
    high:
      "Une élévation est souvent un artefact du prélèvement (globules rouges abîmés dans le tube) ; sinon elle accompagne un effort intense, une destruction de globules rouges ou une inflammation.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "lipase",
    label: "Lipase",
    aliases: ["lipase", "lipasemie"],
    category: "autres",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", low: 13, high: 60 }],
    about: "La lipase est une enzyme produite par le pancréas pour digérer les graisses.",
    high:
      "Une élévation franche, surtout avec des douleurs abdominales, oriente vers une inflammation du pancréas et constitue une urgence médicale.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "tp",
    label: "Taux de prothrombine (TP)",
    aliases: ["taux de prothrombine", "tp", "prothrombine"],
    category: "coagulation",
    unit: "%",
    ranges: [{ unit: "%", low: 70, high: 100 }],
    about:
      "Le TP évalue la vitesse de coagulation du sang. Il dépend de protéines fabriquées par le foie avec l'aide de la vitamine K.",
    high: "Une valeur élevée n'a pas de signification particulière.",
    low:
      "Une valeur basse traduit une coagulation ralentie : traitement anticoagulant, maladie du foie ou manque de vitamine K.",
  },
  {
    key: "inr",
    label: "INR",
    aliases: ["inr", "international normalized ratio"],
    category: "coagulation",
    unit: "",
    ranges: [{ unit: "", low: 0.8, high: 1.2 }],
    about:
      "L'INR est l'expression standardisée du temps de coagulation. Sans traitement anticoagulant il tourne autour de 1 ; sous anticoagulant, la cible est fixée par le médecin.",
    high:
      "Un INR élevé signifie que le sang coagule plus lentement, donc un risque de saignement accru. Sous anticoagulant, il s'interprète par rapport à la cible prescrite, pas par rapport à la norme générale.",
    low: "Un INR bas signifie une coagulation plus rapide ; sous anticoagulant, il traduit une protection insuffisante.",
  },
  {
    key: "d_dimeres",
    label: "D-dimères",
    aliases: ["d dimeres", "d-dimeres", "ddimeres", "d dimere"],
    category: "coagulation",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", high: 500 }],
    about:
      "Les D-dimères sont des fragments issus de la dissolution des caillots. Leur intérêt principal est leur valeur négative : un taux normal rend une phlébite ou une embolie très improbable.",
    high:
      "Une élévation est fréquente et peu spécifique : âge avancé, grossesse, inflammation, chirurgie récente, cancer. Elle ne prouve pas un caillot mais impose de l'écarter par imagerie.",
    low: "Un taux bas est rassurant : il rend l'hypothèse d'un caillot très peu probable.",
  },
  {
    key: "psa",
    label: "PSA (antigène prostatique spécifique)",
    aliases: ["psa", "antigene prostatique specifique", "psa total"],
    category: "tumoraux",
    unit: "ng/mL",
    ranges: [{ sex: "M", unit: "ng/mL", high: 4 }],
    about:
      "Le PSA est une protéine produite par la prostate. Son dosage sert au dépistage et au suivi des affections prostatiques chez l'homme.",
    high:
      "Une élévation peut venir d'une simple augmentation de volume de la prostate liée à l'âge, d'une infection, d'un rapport sexuel ou d'un vélo récent — mais elle justifie toujours un avis urologique.",
    low: "Une valeur basse est le résultat attendu.",
  },
  // ─────────────────────────────── Coagulation ───────────────────────────────
  {
    key: "tca",
    label: "TCA (temps de céphaline activée)",
    aliases: ["tca", "temps de cephaline activee", "temps de cephaline", "tck", "ratio tca"],
    category: "coagulation",
    unit: "",
    ranges: [{ unit: "", low: 0.8, high: 1.2 }, { unit: "s", low: 25, high: 40 }],
    about:
      "Le TCA explore une autre voie de la coagulation que le taux de prothrombine. Les deux se complètent : ensemble, ils couvrent presque toutes les protéines qui font coaguler le sang. Le résultat s'exprime en secondes ou en rapport au témoin.",
    high:
      "Un TCA allongé traduit une coagulation plus lente : traitement anticoagulant, déficit en un facteur de coagulation, ou présence d'un anticoagulant dit circulant. Il s'interprète toujours avec le TP et le contexte.",
    low: "Un TCA raccourci n'a en général pas de signification clinique.",
  },
  {
    key: "antithrombine",
    label: "Antithrombine",
    aliases: ["antithrombine", "antithrombine iii", "at iii", "atiii"],
    category: "coagulation",
    unit: "%",
    ranges: [{ unit: "%", low: 80, high: 120 }],
    about:
      "L'antithrombine est le frein naturel de la coagulation : elle empêche le sang de coaguler au-delà du nécessaire. C'est l'un des examens du bilan de thrombophilie, recherché après une phlébite.",
    low:
      "Un déficit, héréditaire ou acquis, réduit ce frein et augmente le risque de caillot. Il se recherche à distance d'un épisode aigu et en dehors d'un traitement anticoagulant, qui fausse le dosage.",
    high: "Une valeur élevée est sans conséquence connue.",
  },

  // ──────────────────────────────────── Cœur ─────────────────────────────────
  {
    key: "troponine",
    label: "Troponine",
    aliases: ["troponine", "troponine t", "troponine i", "troponine ultrasensible", "troponine hs", "tnt hs"],
    category: "cardiaque",
    unit: "ng/L",
    ranges: [{ unit: "ng/L", high: 14 }],
    about:
      "La troponine est une protéine du muscle cardiaque, libérée dans le sang quand celui-ci souffre. C'est l'examen de référence devant une douleur thoracique, réalisé en urgence et le plus souvent répété à quelques heures d'intervalle.",
    high:
      "Une élévation signale une souffrance du muscle cardiaque, dont l'infarctus est la cause la plus redoutée — mais pas la seule : une insuffisance rénale, une embolie pulmonaire, une myocardite ou un effort très intense l'élèvent aussi. C'est l'évolution entre deux prélèvements qui oriente, et cette interprétation appartient au médecin.",
    low: "Une valeur basse est le résultat attendu et rend une souffrance cardiaque récente très improbable.",
  },
  {
    key: "nt_probnp",
    label: "NT-proBNP",
    aliases: ["nt probnp", "ntprobnp", "bnp", "peptide natriuretique", "nt pro bnp"],
    category: "cardiaque",
    unit: "ng/L",
    ranges: [{ unit: "ng/L", high: 125 }],
    about:
      "Le NT-proBNP est une hormone libérée par le cœur lorsque ses parois sont mises sous tension. Il sert surtout à écarter une insuffisance cardiaque devant un essoufflement : un taux normal la rend très peu probable.",
    high:
      "Une élévation évoque un cœur qui travaille sous contrainte, mais elle monte aussi avec l'âge, en cas d'insuffisance rénale ou de fibrillation auriculaire. Le seuil d'interprétation dépend de l'âge et du contexte.",
    low: "Un taux bas est rassurant et rend l'hypothèse d'une insuffisance cardiaque peu probable.",
  },
  {
    key: "cpk_mb",
    label: "CPK-MB",
    aliases: ["cpk mb", "ck mb", "creatine kinase mb", "cpkmb"],
    category: "cardiaque",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", high: 25 }],
    about:
      "La CPK-MB est la fraction des enzymes musculaires plus spécifiquement présente dans le cœur. Largement remplacée par la troponine, elle figure encore sur certains bilans.",
    high:
      "Une élévation oriente vers une souffrance du muscle cardiaque, mais un effort intense ou une atteinte musculaire suffisent parfois à l'expliquer. La troponine tranche.",
    low: "Une valeur basse est le résultat attendu.",
  },

  // ─────────────────────────────────  Hormones ───────────────────────────────
  //
  // Chez la femme, beaucoup de ces valeurs dépendent du moment du cycle : leur
  // plage de repli est alors volontairement absente, pour ne pas signaler comme
  // anormale une valeur parfaitement attendue. C'est l'intervalle imprimé par
  // le laboratoire, qui tient compte de la phase, qui fait foi.
  {
    key: "fsh",
    label: "FSH (hormone folliculo-stimulante)",
    aliases: ["fsh", "hormone folliculo stimulante", "folliculostimuline"],
    category: "hormones",
    unit: "UI/L",
    ranges: [{ sex: "M", unit: "UI/L", low: 1.5, high: 12.4 }],
    about:
      "La FSH est envoyée par le cerveau vers les ovaires ou les testicules pour stimuler la fabrication des ovules ou des spermatozoïdes. Chez la femme, sa valeur n'a de sens qu'en la rapportant au jour du cycle.",
    high:
      "Une FSH élevée traduit un cerveau qui « pousse » des gonades qui répondent mal. C'est le profil attendu à la ménopause ; en dehors, elle oriente vers une réserve ovarienne diminuée ou une atteinte testiculaire.",
    low:
      "Une FSH basse oriente vers une commande cérébrale insuffisante, parfois liée à un stress important, à une perte de poids marquée, à un sport très intensif, ou à une atteinte de l'hypophyse.",
  },
  {
    key: "lh",
    label: "LH (hormone lutéinisante)",
    aliases: ["lh", "hormone luteinisante", "luteinostimuline"],
    category: "hormones",
    unit: "UI/L",
    ranges: [{ sex: "M", unit: "UI/L", low: 1.7, high: 8.6 }],
    about:
      "La LH est l'autre messagère du cerveau vers les gonades : c'est son pic brutal qui déclenche l'ovulation. Chez la femme, elle se lit impérativement avec le jour du cycle.",
    high:
      "Une LH élevée s'observe à la ménopause, au moment du pic ovulatoire, ou dans le syndrome des ovaires polykystiques où le rapport LH/FSH est souvent augmenté.",
    low: "Une LH basse évoque une commande cérébrale insuffisante, comme pour la FSH.",
  },
  {
    key: "estradiol",
    label: "Œstradiol",
    aliases: ["estradiol", "oestradiol", "e2", "17 beta estradiol"],
    category: "hormones",
    unit: "pg/mL",
    ranges: [{ sex: "M", unit: "pg/mL", low: 10, high: 40 }],
    about:
      "L'œstradiol est le principal œstrogène. Chez la femme il varie d'un facteur dix au cours du cycle, ce qui rend toute lecture impossible sans savoir quel jour le prélèvement a été fait.",
    high:
      "Une valeur élevée est normale en phase pré-ovulatoire. En dehors de ce contexte, ou chez l'homme, elle demande un avis médical.",
    low:
      "Une valeur basse est attendue en début de cycle et après la ménopause. Chez la femme jeune, elle peut accompagner un arrêt des règles lié au poids, au sport intensif ou au stress.",
  },
  {
    key: "progesterone",
    label: "Progestérone",
    aliases: ["progesterone", "progesteronemie"],
    category: "hormones",
    unit: "ng/mL",
    ranges: [],
    about:
      "La progestérone est fabriquée après l'ovulation et prépare l'utérus à une éventuelle grossesse. Dosée vers le 21ᵉ jour du cycle, elle sert surtout à vérifier qu'une ovulation a bien eu lieu.",
    high: "Une valeur élevée en seconde partie de cycle est le signe attendu d'une ovulation. Elle s'élève aussi fortement pendant la grossesse.",
    low:
      "Une valeur basse en seconde partie de cycle suggère une ovulation absente ou de mauvaise qualité — un élément que le médecin replace dans le contexte.",
  },
  {
    key: "testosterone",
    label: "Testostérone totale",
    aliases: ["testosterone", "testosterone totale", "testosteronemie"],
    category: "hormones",
    unit: "ng/mL",
    ranges: [
      { sex: "M", unit: "ng/mL", low: 2.7, high: 10.7 },
      { sex: "F", unit: "ng/mL", low: 0.1, high: 0.6 },
      { sex: "M", unit: "nmol/L", low: 9.4, high: 37 },
      { sex: "F", unit: "nmol/L", low: 0.3, high: 2.1 },
    ],
    about:
      "La testostérone est la principale hormone masculine, présente aussi chez la femme en quantité bien plus faible. Elle varie au cours de la journée et se prélève classiquement le matin.",
    high:
      "Chez la femme, une valeur élevée accompagne souvent un syndrome des ovaires polykystiques, avec acné, pilosité augmentée et cycles irréguliers. Chez l'homme, elle est rarement pathologique en dehors d'une supplémentation.",
    low:
      "Chez l'homme, une valeur basse peut expliquer fatigue, baisse de libido et perte de masse musculaire ; elle se confirme sur un second prélèvement matinal avant toute conclusion.",
  },
  {
    key: "shbg",
    label: "SHBG (protéine de transport des hormones sexuelles)",
    aliases: ["shbg", "sex hormone binding globulin", "proteine vectrice des steroides sexuels"],
    category: "hormones",
    unit: "nmol/L",
    ranges: [
      { sex: "F", unit: "nmol/L", low: 30, high: 90 },
      { sex: "M", unit: "nmol/L", low: 20, high: 60 },
    ],
    about:
      "La SHBG transporte les hormones sexuelles dans le sang. Seule la fraction non liée est active : c'est pourquoi la SHBG permet de calculer la testostérone réellement disponible.",
    high: "Une SHBG élevée s'observe sous œstrogènes, pendant la grossesse, en cas d'hyperthyroïdie ou de maladie du foie ; elle réduit la fraction d'hormone active.",
    low:
      "Une SHBG basse accompagne le surpoids, la résistance à l'insuline et l'hypothyroïdie ; elle augmente la fraction d'hormone libre.",
  },
  {
    key: "prolactine",
    label: "Prolactine",
    aliases: ["prolactine", "prl", "prolactinemie"],
    category: "hormones",
    unit: "ng/mL",
    ranges: [
      { sex: "F", unit: "ng/mL", low: 4, high: 25 },
      { sex: "M", unit: "ng/mL", low: 3, high: 15 },
    ],
    about:
      "La prolactine commande la production de lait après l'accouchement. En dehors de cette période, elle doit rester basse : elle est aussi une hormone du stress et du sommeil, ce qui rend les conditions de prélèvement importantes.",
    high:
      "Une élévation modérée s'explique souvent par le stress du prélèvement, un effort, un rapport sexuel récent ou de nombreux médicaments — antidépresseurs et neuroleptiques notamment. Une élévation franche et confirmée fait rechercher une cause hypophysaire et justifie un avis.",
    low: "Une valeur basse est sans conséquence connue.",
  },
  {
    key: "dhea_s",
    label: "DHEA sulfate",
    aliases: ["dhea sulfate", "dhea s", "sdhea", "s dhea", "dheas", "sulfate de dhea"],
    category: "hormones",
    unit: "µg/dL",
    ranges: [],
    about:
      "La DHEA sulfate est une hormone fabriquée par les glandes surrénales, précurseur des hormones sexuelles. Sa valeur normale diminue fortement avec l'âge, ce qui impose de la lire en face de la tranche d'âge donnée par le laboratoire.",
    high:
      "Une élévation oriente vers une production surrénalienne excessive ; chez la femme, elle accompagne parfois une pilosité augmentée et des cycles irréguliers.",
    low: "Une valeur basse suit surtout l'avancée en âge ; marquée, elle peut évoquer une insuffisance des surrénales.",
  },
  {
    key: "cortisol",
    label: "Cortisol",
    aliases: ["cortisol", "cortisolemie", "cortisol 8h", "cortisol matinal"],
    category: "hormones",
    unit: "µg/dL",
    ranges: [{ unit: "µg/dL", low: 5, high: 25 }, { unit: "nmol/L", low: 140, high: 690 }],
    about:
      "Le cortisol est l'hormone du stress et de l'éveil. Il suit un rythme très marqué sur la journée : maximal au réveil, minimal le soir. L'heure du prélèvement conditionne donc l'interprétation.",
    high:
      "Une valeur élevée accompagne un stress physique ou psychique, une grossesse, une corticothérapie ; une élévation persistante fait rechercher un excès de production et demande un avis.",
    low:
      "Une valeur basse le matin peut évoquer une insuffisance des glandes surrénales, situation qui nécessite un avis médical sans tarder.",
  },
  {
    key: "acth",
    label: "ACTH",
    aliases: ["acth", "corticotrophine", "hormone corticotrope"],
    category: "hormones",
    unit: "pg/mL",
    ranges: [{ unit: "pg/mL", low: 10, high: 60 }],
    about:
      "L'ACTH est l'ordre envoyé par l'hypophyse aux glandes surrénales pour produire du cortisol. Dosée avec lui, elle indique si un déséquilibre vient du cerveau ou des surrénales elles-mêmes.",
    high: "Une ACTH élevée traduit une commande cérébrale forte, soit pour compenser des surrénales défaillantes, soit par production excessive.",
    low: "Une ACTH basse oriente vers une commande hypophysaire insuffisante, ou vers un excès de cortisol d'origine surrénalienne qui freine l'hypophyse.",
  },
  {
    key: "amh",
    label: "AMH (hormone anti-müllérienne)",
    aliases: ["amh", "hormone anti mullerienne", "anti mullerienne"],
    category: "hormones",
    unit: "ng/mL",
    ranges: [],
    about:
      "L'AMH reflète le stock d'ovocytes encore disponibles. Contrairement à la plupart des hormones féminines, elle ne dépend pas du jour du cycle, ce qui la rend commode. Sa valeur normale baisse régulièrement avec l'âge.",
    high:
      "Une AMH élevée pour l'âge s'observe dans le syndrome des ovaires polykystiques, où les follicules sont nombreux.",
    low:
      "Une AMH basse traduit une réserve ovarienne diminuée. Elle ne dit rien de la fertilité du mois en cours et ne se lit qu'avec l'âge et le contexte, auprès d'un médecin.",
  },
  {
    key: "hcg",
    label: "hCG (bêta-hCG)",
    aliases: ["hcg", "beta hcg", "b hcg", "gonadotrophine chorionique", "hcg totale"],
    category: "hormones",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", high: 5 }],
    about:
      "L'hCG est l'hormone produite par le placenta : c'est elle que détectent les tests de grossesse. En dehors d'une grossesse, elle doit être quasiment indétectable.",
    high:
      "Une valeur élevée signe le plus souvent une grossesse débutante, et sa progression sur quarante-huit heures renseigne davantage qu'une valeur isolée. En dehors de ce contexte, elle demande un avis médical.",
    low: "Une valeur indétectable est le résultat attendu hors grossesse.",
  },
  {
    key: "pth",
    label: "Parathormone (PTH)",
    aliases: ["parathormone", "pth", "pth intacte", "hormone parathyroidienne"],
    category: "hormones",
    unit: "pg/mL",
    ranges: [{ unit: "pg/mL", low: 15, high: 65 }],
    about:
      "La parathormone règle le calcium du sang : elle le fait monter en puisant dans les os et en économisant le calcium au niveau des reins. Elle se lit toujours en même temps que la calcémie et la vitamine D.",
    high:
      "Une PTH élevée avec un calcium élevé oriente vers les glandes parathyroïdes elles-mêmes. Avec un calcium normal ou bas, elle traduit le plus souvent une réaction à un manque de vitamine D — situation fréquente et corrigeable.",
    low: "Une PTH basse accompagne un calcium élevé d'une autre origine, ou une insuffisance des glandes parathyroïdes.",
  },
  {
    key: "igf_1",
    label: "IGF-1 (somatomédine C)",
    aliases: ["igf 1", "igf1", "somatomedine c", "insulin like growth factor"],
    category: "hormones",
    unit: "ng/mL",
    ranges: [],
    about:
      "L'IGF-1 est le messager de l'hormone de croissance : plus stable qu'elle dans le sang, il en reflète bien la production sur la durée. Sa valeur normale dépend étroitement de l'âge.",
    high: "Une valeur élevée pour l'âge fait rechercher un excès d'hormone de croissance et demande un avis spécialisé.",
    low: "Une valeur basse peut traduire un déficit en hormone de croissance, mais aussi une dénutrition ou une maladie du foie.",
  },

  // ───────────────────── Compléments thyroïdiens ─────────────────────────────
  {
    key: "anti_tg",
    label: "Anticorps anti-thyroglobuline",
    aliases: ["anticorps anti thyroglobuline", "anti thyroglobuline", "ac anti tg", "anti tg"],
    category: "thyroide",
    unit: "UI/mL",
    ranges: [{ unit: "UI/mL", high: 115 }],
    about:
      "Ces anticorps sont dirigés contre la thyroglobuline, la protéine à partir de laquelle la thyroïde fabrique ses hormones. Ils se dosent avec les anti-TPO pour préciser l'origine auto-immune d'un dérèglement.",
    high:
      "Un taux élevé accompagne une thyroïdite auto-immune. Il peut aussi exister sans aucun retentissement sur le fonctionnement de la thyroïde, et justifie alors une simple surveillance de la TSH.",
    low: "Un taux bas ou indétectable est le résultat attendu.",
  },
  {
    key: "thyroglobuline",
    label: "Thyroglobuline",
    // « TG » n'est pas repris ici : sur un compte rendu, il désigne les triglycérides.
    aliases: ["thyroglobuline", "thyroglobulinemie"],
    category: "thyroide",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", low: 1.5, high: 38 }],
    about:
      "La thyroglobuline est la protéine de réserve de la thyroïde. Son dosage sert surtout de repère de surveillance après le traitement de certaines maladies thyroïdiennes.",
    high: "Une élévation s'observe en cas de goitre, d'inflammation de la thyroïde, ou d'activité thyroïdienne augmentée.",
    low: "Une valeur basse est attendue après ablation de la thyroïde ; en dehors de ce contexte, elle est sans signification particulière.",
  },
  {
    key: "trak",
    label: "Anticorps anti-récepteurs de la TSH (TRAK)",
    aliases: ["anticorps anti recepteurs de la tsh", "trak", "anti rtsh", "ac anti recepteur tsh", "trab"],
    category: "thyroide",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", high: 1.75 }],
    about:
      "Ces anticorps se fixent sur le récepteur qui commande la thyroïde et l'activent en continu, comme un interrupteur bloqué. Ils sont la signature de la maladie de Basedow.",
    high:
      "Un taux élevé oriente vers une hyperthyroïdie d'origine auto-immune et demande une prise en charge médicale ; il sert ensuite à suivre l'évolution sous traitement.",
    low: "Un taux bas ou indétectable est le résultat attendu.",
  },
  {
    key: "t4_totale",
    label: "T4 totale",
    aliases: ["t4 totale", "thyroxine totale", "t4t"],
    category: "thyroide",
    unit: "nmol/L",
    ranges: [{ unit: "nmol/L", low: 60, high: 140 }],
    about:
      "La T4 totale additionne l'hormone libre et celle liée à ses transporteurs. Elle varie donc avec la quantité de transporteurs — sous pilule ou pendant la grossesse notamment — ce qui explique qu'on lui préfère aujourd'hui la T4 libre.",
    high: "Une élévation accompagne une hyperthyroïdie, mais aussi une simple augmentation des protéines de transport.",
    low: "Une valeur basse accompagne une hypothyroïdie ou une baisse des protéines de transport.",
  },
  {
    key: "t3_totale",
    label: "T3 totale",
    aliases: ["t3 totale", "triiodothyronine totale", "t3t"],
    category: "thyroide",
    unit: "nmol/L",
    ranges: [{ unit: "nmol/L", low: 1.2, high: 3.0 }],
    about:
      "La T3 totale mesure l'ensemble de la forme la plus active des hormones thyroïdiennes, liée et libre. Comme la T4 totale, elle dépend des protéines de transport.",
    high: "Une élévation accompagne une hyperthyroïdie.",
    low: "Une valeur basse s'observe en hypothyroïdie, mais aussi lors de toute maladie aiguë sans que la thyroïde soit en cause.",
  },

  // ─────────────────────── Compléments rénaux et hépatiques ──────────────────
  {
    key: "cystatine_c",
    label: "Cystatine C",
    aliases: ["cystatine c", "cystatine"],
    category: "renal",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", low: 0.5, high: 1.0 }],
    about:
      "La cystatine C estime la fonction rénale comme la créatinine, mais sans dépendre de la masse musculaire. Elle est donc utile chez les personnes très musclées, très minces ou âgées, chez qui la créatinine trompe.",
    high: "Une élévation traduit un filtrage rénal moins efficace, avec moins d'interférences que la créatinine.",
    low: "Une valeur basse n'a pas de signification clinique particulière.",
  },
  {
    key: "bilirubine_libre",
    label: "Bilirubine libre (non conjuguée)",
    aliases: ["bilirubine libre", "bilirubine non conjuguee", "bilirubine indirecte"],
    category: "hepatique",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", high: 12 }],
    about:
      "C'est la bilirubine que le foie n'a pas encore transformée. Comparée à la bilirubine conjuguée, elle indique si un excès vient d'avant le foie ou d'après.",
    high:
      "Une élévation isolée de cette fraction correspond très souvent au syndrome de Gilbert, particularité génétique bénigne et fréquente. Elle peut aussi traduire une destruction accrue de globules rouges.",
    low: "Une valeur basse est sans signification.",
  },
  {
    key: "cdt",
    label: "CDT (transferrine déficiente en carbohydrates)",
    aliases: ["cdt", "transferrine desialylee", "transferrine deficiente en carbohydrates", "carbohydrate deficient transferrin"],
    category: "hepatique",
    unit: "%",
    ranges: [{ unit: "%", high: 1.7 }],
    about:
      "La CDT est une forme particulière de transferrine dont la proportion augmente en cas de consommation d'alcool régulière et importante sur plusieurs semaines. Elle sert de repère objectif dans le suivi.",
    high:
      "Une élévation évoque une consommation d'alcool soutenue sur les semaines précédentes. Certaines maladies du foie rares peuvent aussi l'élever, d'où l'importance de l'avis médical.",
    low: "Une valeur basse est le résultat attendu.",
  },
  {
    key: "amylase",
    label: "Amylase",
    aliases: ["amylase", "amylasemie", "alpha amylase"],
    category: "autres",
    unit: "UI/L",
    ranges: [{ unit: "UI/L", low: 25, high: 125 }],
    about:
      "L'amylase est une enzyme qui digère les sucres, produite par le pancréas et les glandes salivaires. Elle se dose avec la lipase devant une douleur abdominale.",
    high:
      "Une élévation franche, avec des douleurs abdominales, oriente vers une inflammation du pancréas et constitue une urgence. Une atteinte des glandes salivaires l'élève aussi.",
    low: "Une valeur basse n'a pas de signification clinique.",
  },
  {
    key: "myoglobine",
    label: "Myoglobine",
    aliases: ["myoglobine", "myoglobinemie"],
    category: "autres",
    unit: "µg/L",
    ranges: [
      { sex: "F", unit: "µg/L", low: 12, high: 76 },
      { sex: "M", unit: "µg/L", low: 19, high: 92 },
    ],
    about:
      "La myoglobine est la protéine qui stocke l'oxygène dans les muscles. Elle passe très vite dans le sang quand une fibre musculaire est abîmée.",
    high:
      "Une élévation suit un effort intense, une chute, une injection intramusculaire ou une souffrance musculaire plus marquée. Elle monte aussi quand les reins l'éliminent moins bien.",
    low: "Une valeur basse est sans signification.",
  },
  {
    key: "lactate",
    label: "Lactates",
    aliases: ["lactates", "lactate", "acide lactique", "lactatemie"],
    category: "autres",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 0.5, high: 2.2 }],
    about:
      "Les lactates s'accumulent lorsque les cellules produisent de l'énergie sans assez d'oxygène. C'est ce qui se passe pendant un effort intense — et, dans un tout autre registre, lorsqu'un organe est mal irrigué.",
    high:
      "Une élévation suit très souvent un effort ou un garrot serré au moment du prélèvement. Une élévation franche en dehors de ce contexte est un signal d'alerte qui relève du médecin.",
    low: "Une valeur basse est sans signification.",
  },

  // ─────────────────────── Compléments lipidiques et glycémiques ─────────────
  {
    key: "apolipoproteine_a1",
    label: "Apolipoprotéine A1",
    aliases: ["apolipoproteine a1", "apolipoproteine a 1", "apo a1", "apoa1"],
    category: "lipides",
    unit: "g/L",
    ranges: [
      { sex: "F", unit: "g/L", low: 1.25, high: 2.15 },
      { sex: "M", unit: "g/L", low: 1.1, high: 2.05 },
    ],
    about:
      "L'apolipoprotéine A1 est la protéine qui structure le bon cholestérol. Compter les particules protectrices plutôt que le cholestérol qu'elles transportent affine parfois l'évaluation du risque.",
    high: "Une valeur élevée va dans le sens d'une protection des artères.",
    low: "Une valeur basse accompagne un HDL bas et réduit cette protection ; l'activité physique est le levier le plus efficace.",
  },
  {
    key: "apolipoproteine_b",
    label: "Apolipoprotéine B",
    aliases: ["apolipoproteine b", "apo b", "apob", "apolipoproteine b100"],
    category: "lipides",
    unit: "g/L",
    ranges: [{ unit: "g/L", high: 1.2 }],
    about:
      "Chaque particule qui dépose du cholestérol sur les artères porte exactement une apolipoprotéine B. La doser revient donc à compter ces particules, ce qui reflète le risque mieux que le LDL lorsque les triglycérides sont élevés.",
    high:
      "Une valeur élevée signale un grand nombre de particules athérogènes. Comme pour le LDL, la cible dépend du risque cardiovasculaire global, que le médecin apprécie.",
    low: "Une valeur basse est favorable pour les artères.",
  },
  {
    key: "lipoproteine_a",
    label: "Lipoprotéine (a)",
    aliases: ["lipoproteine a", "lp a", "lpa", "lipoproteine petit a"],
    category: "lipides",
    unit: "mg/dL",
    ranges: [{ unit: "mg/dL", high: 30 }, { unit: "nmol/L", high: 75 }],
    about:
      "La lipoprotéine (a) est une particule dont le taux est fixé par la génétique et ne bouge presque pas avec l'alimentation. Elle se dose en général une seule fois dans la vie.",
    high:
      "Une valeur élevée constitue un facteur de risque cardiovasculaire indépendant, hérité. Elle ne se corrige pas par l'hygiène de vie, mais elle incite à mieux maîtriser tous les autres facteurs — c'est là son utilité.",
    low:
      "Une valeur basse est favorable : elle retire un facteur de risque cardiovasculaire du tableau, et n'appelle aucune surveillance particulière.",
  },
  {
    key: "rapport_cholesterol_hdl",
    label: "Rapport cholestérol total / HDL",
    aliases: ["rapport cholesterol total hdl", "rapport cholesterol hdl", "rapport ct hdl", "indice d atherogenicite"],
    category: "lipides",
    unit: "",
    ranges: [{ sex: "F", unit: "", high: 4.5 }, { sex: "M", unit: "", high: 5.0 }],
    about:
      "Ce rapport résume en un chiffre l'équilibre entre le cholestérol qui se dépose et celui qui nettoie. Il complète utilement la lecture des valeurs prises séparément.",
    high: "Un rapport élevé traduit un déséquilibre au détriment du bon cholestérol, souvent améliorable par l'activité physique.",
    low: "Un rapport bas traduit un profil lipidique favorable.",
  },
  {
    key: "peptide_c",
    label: "Peptide C",
    aliases: ["peptide c", "c peptide", "peptide c a jeun"],
    category: "glycemie",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", low: 0.9, high: 4.0 }],
    about:
      "Le peptide C est libéré en même quantité que l'insuline par le pancréas. Contrairement à elle, il n'est pas modifié par une insuline injectée : il mesure donc la production propre du pancréas.",
    high: "Une valeur élevée accompagne une résistance à l'insuline : le pancréas produit davantage pour obtenir le même effet.",
    low: "Une valeur basse traduit une production pancréatique insuffisante.",
  },
  {
    key: "fructosamine",
    label: "Fructosamine",
    aliases: ["fructosamine", "fructosamines"],
    category: "glycemie",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", low: 200, high: 285 }],
    about:
      "La fructosamine reflète la glycémie moyenne des deux à trois dernières semaines, là où l'hémoglobine glyquée en couvre trois mois. Elle prend le relais quand celle-ci n'est pas fiable, par exemple en cas d'anémie.",
    high: "Une valeur élevée traduit des glycémies moyennes hautes sur les dernières semaines.",
    low: "Une valeur basse peut accompagner une baisse des protéines du sang, qui fausse la mesure.",
  },
  {
    key: "calcium_ionise",
    label: "Calcium ionisé",
    aliases: ["calcium ionise", "calcium libre", "ca ionise"],
    category: "ionogramme",
    unit: "mmol/L",
    ranges: [{ unit: "mmol/L", low: 1.15, high: 1.35 }],
    about:
      "C'est la fraction du calcium réellement active, non liée aux protéines. Elle donne une lecture plus juste que le calcium total quand l'albumine est anormale.",
    high: "Une valeur élevée mérite un avis médical : elle oriente vers les glandes parathyroïdes ou un excès de vitamine D.",
    low: "Une valeur basse peut donner des fourmillements et des crampes, et accompagne souvent un déficit en vitamine D.",
  },

  // ──────────────────── Vitamines et oligo-éléments ──────────────────────────
  {
    key: "vitamine_a",
    label: "Vitamine A (rétinol)",
    aliases: ["vitamine a", "retinol", "vit a"],
    category: "vitamines",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", low: 0.3, high: 0.8 }, { unit: "µmol/L", low: 1.05, high: 2.8 }],
    about:
      "La vitamine A est indispensable à la vision, en particulier nocturne, ainsi qu'à la peau et aux défenses immunitaires. Elle est stockée par le foie.",
    high:
      "Un excès provient presque toujours d'une supplémentation trop dosée et peut donner maux de tête, nausées et douleurs osseuses. Il est déconseillé pendant la grossesse.",
    low:
      "Une carence, rare en France, s'observe en cas de mauvaise absorption des graisses ou de dénutrition ; elle se manifeste d'abord par une gêne à voir dans la pénombre.",
  },
  {
    key: "vitamine_e",
    label: "Vitamine E (tocophérol)",
    aliases: ["vitamine e", "tocopherol", "alpha tocopherol", "vit e"],
    category: "vitamines",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", low: 5, high: 20 }],
    about:
      "La vitamine E protège les membranes des cellules de l'oxydation. Elle circule avec les graisses du sang, ce qui impose de la lire en tenant compte du bilan lipidique.",
    high: "Une valeur élevée résulte d'une supplémentation et reste rarement problématique.",
    low: "Une carence accompagne surtout les maladies qui gênent l'absorption des graisses ; prolongée, elle peut retentir sur les nerfs.",
  },
  {
    key: "vitamine_b1",
    label: "Vitamine B1 (thiamine)",
    aliases: ["vitamine b1", "thiamine", "vit b1"],
    category: "vitamines",
    unit: "nmol/L",
    ranges: [{ unit: "nmol/L", low: 70, high: 180 }],
    about:
      "La vitamine B1 permet aux cellules de tirer de l'énergie des sucres. Le cerveau et le cœur en sont particulièrement dépendants.",
    high: "Une valeur élevée provient d'une supplémentation et est sans danger connu.",
    low:
      "Une carence s'observe en cas de consommation d'alcool régulière, de dénutrition, de vomissements prolongés ou après chirurgie de l'obésité. Elle peut retentir sur les nerfs et demande une correction rapide.",
  },
  {
    key: "vitamine_b6",
    label: "Vitamine B6 (pyridoxine)",
    aliases: ["vitamine b6", "pyridoxine", "vit b6"],
    category: "vitamines",
    unit: "nmol/L",
    ranges: [{ unit: "nmol/L", low: 20, high: 120 }],
    about:
      "La vitamine B6 intervient dans la fabrication des protéines, des neurotransmetteurs et de l'hémoglobine. Elle participe aussi au recyclage de l'homocystéine.",
    high:
      "Un excès prolongé, toujours lié à une supplémentation, peut paradoxalement abîmer les nerfs et provoquer des fourmillements : ce n'est pas une vitamine anodine à haute dose.",
    low: "Une carence accompagne l'alcool, certaines maladies inflammatoires et quelques traitements ; elle peut donner une anémie et des fourmillements.",
  },
  {
    key: "zinc",
    label: "Zinc",
    aliases: ["zinc", "zn", "zincemie"],
    category: "vitamines",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", low: 0.7, high: 1.2 }, { unit: "µmol/L", low: 11, high: 18 }],
    about:
      "Le zinc participe à la cicatrisation, à l'immunité, au goût et à l'odorat. Une inflammation en cours fait baisser sa valeur sanguine sans qu'il y ait de vrai déficit.",
    high: "Une valeur élevée provient d'une supplémentation ; en excès prolongé, elle gêne l'absorption du cuivre.",
    low:
      "Un déficit s'observe en alimentation végétarienne, en cas de maladie digestive ou de consommation d'alcool. Il peut donner une cicatrisation lente, une perte du goût et des ongles fragiles.",
  },
  {
    key: "cuivre",
    label: "Cuivre",
    aliases: ["cuivre", "cu", "cupremie"],
    category: "vitamines",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", low: 0.7, high: 1.4 }, { unit: "µmol/L", low: 11, high: 22 }],
    about:
      "Le cuivre intervient dans la fabrication des globules rouges, du collagène et dans la protection contre l'oxydation. Il circule lié à la céruloplasmine.",
    high:
      "Une élévation s'observe sous œstrogènes, pendant la grossesse et lors d'une inflammation ; une valeur très élevée demande un avis.",
    low:
      "Un déficit, rare, peut suivre une supplémentation excessive en zinc ou une malabsorption, et donner une anémie résistante au fer.",
  },
  {
    key: "selenium",
    label: "Sélénium",
    aliases: ["selenium", "se", "selenemie"],
    category: "vitamines",
    unit: "µg/L",
    ranges: [{ unit: "µg/L", low: 70, high: 120 }],
    about:
      "Le sélénium protège les cellules de l'oxydation et participe au fonctionnement de la thyroïde. Les apports dépendent beaucoup des sols où poussent les aliments.",
    high: "Un excès, toujours lié à une supplémentation, peut donner une haleine aillée et des ongles cassants.",
    low: "Un déficit s'observe en cas de dénutrition ou de malabsorption ; il retentit sur l'immunité et la thyroïde.",
  },
  {
    key: "homocysteine",
    label: "Homocystéine",
    aliases: ["homocysteine", "homocysteinemie"],
    category: "vitamines",
    unit: "µmol/L",
    ranges: [{ unit: "µmol/L", low: 5, high: 15 }],
    about:
      "L'homocystéine est un acide aminé que l'organisme recycle grâce aux vitamines B9, B12 et B6. Son taux monte donc dès que l'une d'elles manque, ce qui en fait un bon révélateur de carence.",
    high:
      "Une élévation traduit le plus souvent un manque de folates ou de vitamine B12, parfois une particularité génétique ou une fonction rénale diminuée. Elle est aussi considérée comme un facteur de risque cardiovasculaire.",
    low: "Une valeur basse est favorable et sans conséquence.",
  },

  // ──────────────────── Inflammation, immunité ───────────────────────────────
  {
    key: "procalcitonine",
    label: "Procalcitonine",
    aliases: ["procalcitonine", "pct"],
    category: "inflammation",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", high: 0.5 }],
    about:
      "La procalcitonine s'élève surtout lors des infections bactériennes, beaucoup moins lors des infections virales. C'est ce qui la rend utile pour décider d'un antibiotique, là où la CRP ne fait pas la différence.",
    high:
      "Une élévation oriente vers une infection bactérienne ; plus elle est franche, plus l'infection est étendue. Cette lecture appartient au médecin, dans le contexte clinique.",
    low: "Une valeur basse rend une infection bactérienne sévère peu probable.",
  },
  {
    key: "haptoglobine",
    label: "Haptoglobine",
    aliases: ["haptoglobine", "haptoglobinemie"],
    category: "inflammation",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 0.3, high: 2.0 }],
    about:
      "L'haptoglobine récupère l'hémoglobine libérée quand un globule rouge se casse dans la circulation. Elle est aussi une protéine de l'inflammation, d'où une double lecture.",
    high: "Une élévation accompagne une inflammation ou une infection.",
    low:
      "Une valeur basse est le signe le plus fiable d'une destruction accrue des globules rouges : consommée par l'hémoglobine libérée, elle s'effondre. Elle peut aussi baisser en cas de maladie du foie.",
  },

  // ──────────────────── Protéines de l'immunité ──────────────────────────────
  {
    key: "complement_c3",
    label: "Complément C3",
    aliases: ["complement c3", "c3", "fraction c3 du complement"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 0.9, high: 1.8 }],
    about:
      "Le complément est un ensemble de protéines qui épaulent les anticorps pour détruire les microbes. Le C3 en est la pièce centrale.",
    high: "Une élévation accompagne une inflammation, sans grande spécificité.",
    low:
      "Une valeur basse traduit une consommation du complément par le système immunitaire, ce qui s'observe dans certaines maladies auto-immunes et rénales ; elle relève d'un avis spécialisé.",
  },
  {
    key: "complement_c4",
    label: "Complément C4",
    aliases: ["complement c4", "c4", "fraction c4 du complement"],
    category: "proteines",
    unit: "g/L",
    ranges: [{ unit: "g/L", low: 0.1, high: 0.4 }],
    about:
      "Le C4 est une autre pièce du complément. Lu avec le C3, il aide à distinguer les mécanismes par lesquels le système immunitaire s'active.",
    high: "Une élévation accompagne une inflammation.",
    low:
      "Une baisse isolée du C4 oriente vers certaines maladies auto-immunes ou vers un angio-œdème héréditaire ; elle demande un avis spécialisé.",
  },
  {
    key: "facteur_rhumatoide",
    label: "Facteur rhumatoïde",
    aliases: ["facteur rhumatoide", "fr", "latex waaler rose", "waaler rose"],
    category: "proteines",
    unit: "UI/mL",
    ranges: [{ unit: "UI/mL", high: 20 }],
    about:
      "Le facteur rhumatoïde est un anticorps dirigé contre l'organisme lui-même, recherché devant des douleurs articulaires. Il est ancien et peu spécifique : sa présence ne suffit jamais à poser un diagnostic.",
    high:
      "Un taux élevé s'observe dans la polyarthrite rhumatoïde, mais aussi dans d'autres maladies auto-immunes, certaines infections prolongées, et chez des personnes âgées en parfaite santé. Il se lit avec les anti-CCP et l'examen clinique.",
    low: "Un taux bas est le résultat attendu et rend une polyarthrite moins probable, sans l'exclure.",
  },
  {
    key: "anti_ccp",
    label: "Anticorps anti-CCP",
    aliases: ["anticorps anti ccp", "anti ccp", "ac anti ccp", "acpa", "anti peptides citrullines"],
    category: "proteines",
    unit: "U/mL",
    ranges: [{ unit: "U/mL", high: 17 }],
    about:
      "Ces anticorps sont bien plus spécifiques de la polyarthrite rhumatoïde que le facteur rhumatoïde, et peuvent apparaître des années avant les premiers symptômes.",
    high:
      "Un taux élevé oriente fortement vers une polyarthrite rhumatoïde et justifie un avis rhumatologique, d'autant que la prise en charge précoce change le pronostic.",
    low:
      "Un taux bas est le résultat attendu et rend une polyarthrite rhumatoïde nettement moins probable, sans l'écarter totalement chez une personne symptomatique.",
  },
  {
    key: "anti_transglutaminase",
    label: "Anticorps anti-transglutaminase",
    aliases: ["anticorps anti transglutaminase", "anti transglutaminase", "ac anti transglutaminase", "iga anti transglutaminase", "anti ttg"],
    category: "proteines",
    unit: "U/mL",
    ranges: [{ unit: "U/mL", high: 10 }],
    about:
      "Ces anticorps sont l'examen de première intention pour dépister la maladie cœliaque, l'intolérance au gluten. Ils se dosent avec les IgA totales, car un déficit en IgA rendrait le test faussement négatif.",
    high:
      "Un taux élevé rend une maladie cœliaque probable et conduit à un avis spécialisé. Important : il ne faut pas arrêter le gluten avant les examens, sous peine de fausser le diagnostic.",
    low: "Un taux bas rend la maladie cœliaque peu probable, à condition que les IgA totales soient normales.",
  },
  {
    key: "ige_totales",
    label: "IgE totales",
    aliases: ["ige totales", "ige totale", "immunoglobulines e", "ige"],
    category: "proteines",
    unit: "UI/mL",
    ranges: [{ unit: "UI/mL", high: 100 }],
    about:
      "Les immunoglobulines E sont les anticorps de l'allergie et de la défense contre les parasites. Leur taux global dit qu'un terrain allergique existe, jamais à quoi on est allergique.",
    high:
      "Une élévation accompagne un terrain allergique — asthme, rhinite, eczéma — ou une parasitose. Identifier l'allergène demande des tests ciblés.",
    low: "Un taux bas rend un terrain allergique moins probable, sans l'exclure.",
  },
  {
    key: "beta_2_microglobuline",
    label: "Bêta-2-microglobuline",
    aliases: ["beta 2 microglobuline", "b2 microglobuline", "beta2 microglobuline"],
    category: "proteines",
    unit: "mg/L",
    ranges: [{ unit: "mg/L", low: 0.8, high: 2.4 }],
    about:
      "Cette petite protéine est présente à la surface de presque toutes les cellules et éliminée par les reins. Elle sert de marqueur de suivi dans certaines maladies du sang.",
    high:
      "Une élévation traduit souvent une fonction rénale diminuée, parfois un renouvellement cellulaire accru ou une inflammation. Elle s'interprète dans un contexte précis.",
    low: "Une valeur basse est sans signification particulière.",
  },

  // ─────────────────────────── Marqueurs tumoraux ────────────────────────────
  //
  // Ces dosages sont souvent lus avec inquiétude. Les textes rappellent donc
  // systématiquement ce qu'ils ne sont pas : un test de dépistage du cancer.
  {
    key: "ace",
    label: "ACE (antigène carcino-embryonnaire)",
    aliases: ["antigene carcino embryonnaire", "ace", "cea"],
    category: "tumoraux",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", high: 5 }],
    about:
      "L'ACE est une protéine surtout utilisée pour surveiller l'évolution d'une maladie déjà connue, et non pour en dépister une. Sur une personne sans antécédent, sa valeur isolée n'apprend presque rien.",
    high:
      "Une élévation modérée est fréquente et souvent bénigne : le tabagisme, une inflammation digestive, une maladie du foie l'élèvent. C'est l'évolution du chiffre dans le temps, chez une personne suivie, qui compte — et son interprétation appartient au médecin.",
    low: "Une valeur basse est le résultat attendu.",
  },
  {
    key: "afp",
    label: "Alpha-fœtoprotéine (AFP)",
    aliases: ["alpha foetoproteine", "afp", "alphafoetoproteine"],
    category: "tumoraux",
    unit: "ng/mL",
    ranges: [{ unit: "ng/mL", high: 10 }],
    about:
      "L'AFP est une protéine normalement produite pendant la vie fœtale. Chez l'adulte, elle sert au suivi de certaines maladies du foie et à l'évaluation d'anomalies pendant la grossesse.",
    high:
      "Une élévation s'observe pendant la grossesse, ce qui est normal, et lors de maladies du foie comme l'hépatite ou la cirrhose. Une valeur élevée demande un avis médical qui la replacera dans son contexte.",
    low: "Une valeur basse est le résultat attendu hors grossesse.",
  },
  {
    key: "ca_15_3",
    label: "CA 15-3",
    aliases: ["ca 15 3", "ca153", "ca 15.3", "antigene 15 3"],
    category: "tumoraux",
    unit: "U/mL",
    ranges: [{ unit: "U/mL", high: 30 }],
    about:
      "Le CA 15-3 sert à suivre l'évolution d'une maladie du sein déjà diagnostiquée. Ce n'est pas un test de dépistage : il n'a pas de valeur pour rechercher un cancer chez une personne sans antécédent.",
    high:
      "Une élévation modérée s'observe aussi lors d'affections bénignes du sein, de maladies du foie ou d'une inflammation. Seule l'évolution du chiffre, dans un suivi médical, est interprétable.",
    low: "Une valeur basse est le résultat attendu.",
  },
  {
    key: "ca_125",
    label: "CA 125",
    aliases: ["ca 125", "ca125", "antigene 125"],
    category: "tumoraux",
    unit: "U/mL",
    ranges: [{ unit: "U/mL", high: 35 }],
    about:
      "Le CA 125 est utilisé pour suivre certaines maladies ovariennes déjà connues. Il est réputé peu spécifique : de nombreuses situations parfaitement bénignes l'élèvent.",
    high:
      "L'endométriose, des fibromes, des règles, une grossesse, une inflammation du péritoine ou une maladie du foie l'élèvent couramment. Une valeur au-dessus du seuil n'a donc, isolément, pas de valeur diagnostique — elle appelle un avis médical, pas une conclusion.",
    low: "Une valeur basse est le résultat attendu.",
  },
  {
    key: "ca_19_9",
    label: "CA 19-9",
    aliases: ["ca 19 9", "ca199", "ca 19.9", "antigene 19 9"],
    category: "tumoraux",
    unit: "U/mL",
    ranges: [{ unit: "U/mL", high: 37 }],
    about:
      "Le CA 19-9 sert au suivi de maladies digestives et pancréatiques déjà diagnostiquées. Comme les autres marqueurs de cette famille, ce n'est pas un examen de dépistage.",
    high:
      "Une élévation accompagne fréquemment des situations bénignes : obstacle sur les voies biliaires, pancréatite, diabète, maladie du foie. Une part de la population ne le produit même pas, ce qui rend le dosage ininterprétable chez elle.",
    low: "Une valeur basse est le résultat attendu.",
  },

];

/** Index par clé pour un accès direct. */
export const MARKERS_BY_KEY: Record<string, Marker> = Object.fromEntries(
  MARKERS.map((m) => [m.key, m]),
);
