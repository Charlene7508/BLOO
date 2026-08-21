/**
 * Contrôle d'intégrité du catalogue :
 *   npx tsx scripts/check-catalog.mts
 *
 * Vérifie qu'aucun marqueur n'en détourne un autre. C'est le risque principal
 * quand le catalogue grandit : un alias trop court ou trop générique capte
 * silencieusement les résultats d'un voisin.
 */
import { MARKERS } from "@/lib/markers/catalog";
import { matchMarker } from "@/lib/parsing/matchMarker";
import { CATEGORY_LABELS } from "@/lib/markers/types";

let failures = 0;
const fail = (message: string) => {
  console.log(`  ✗ ${message}`);
  failures++;
};

// 1. Unicité des clés — elles sont stockées dans les analyses enregistrées.
const keys = new Set<string>();
for (const marker of MARKERS) {
  if (keys.has(marker.key)) fail(`clé en double : ${marker.key}`);
  keys.add(marker.key);
}

// 2. Chaque libellé et chaque alias doit retrouver son propre marqueur.
for (const marker of MARKERS) {
  for (const term of [marker.label, ...marker.aliases]) {
    const found = matchMarker(term);
    if (!found) fail(`« ${term} » ne correspond à aucun marqueur (attendu : ${marker.key})`);
    else if (found.key !== marker.key) {
      fail(`« ${term} » (${marker.key}) est capté par ${found.key}`);
    }
  }
}

// 3. Cohérence des plages : bornes ordonnées, unité renseignée.
for (const marker of MARKERS) {
  for (const range of marker.ranges) {
    if (range.low !== undefined && range.high !== undefined && range.low >= range.high) {
      fail(`${marker.key} : plage inversée (${range.low} – ${range.high})`);
    }
    if (range.low === undefined && range.high === undefined) {
      fail(`${marker.key} : plage sans aucune borne`);
    }
  }
}

// 4. Textes du glossaire présents et non tronqués.
for (const marker of MARKERS) {
  for (const [field, text] of [["about", marker.about], ["high", marker.high], ["low", marker.low]] as const) {
    if (!text || text.trim().length < 40) fail(`${marker.key} : texte « ${field} » absent ou trop court`);
  }
}

const byCategory = new Map<string, number>();
for (const m of MARKERS) byCategory.set(m.category, (byCategory.get(m.category) ?? 0) + 1);

console.log(`\n${MARKERS.length} marqueurs, ${byCategory.size} familles :`);
for (const [category, count] of [...byCategory.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(3)}  ${CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}`);
}
console.log(failures === 0 ? "\n✓ catalogue cohérent" : `\n✗ ${failures} problème(s)`);
process.exit(failures === 0 ? 0 : 1);
