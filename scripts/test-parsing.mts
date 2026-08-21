/**
 * Banc d'essai du parseur, à lancer sur de vrais comptes rendus :
 *   npx tsx scripts/test-parsing.ts <fichier.pdf> [...]
 * Les fichiers de test restent hors du dépôt : ce sont des données de santé.
 */
import fs from "node:fs";
import { extractFromPdf } from "@/lib/parsing/extract";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: npx tsx scripts/test-parsing.ts <fichier.pdf> [...]");
  process.exit(1);
}

for (const file of files) {
  const outcome = await extractFromPdf(new Uint8Array(fs.readFileSync(file)));
  console.log(`\n=== ${file}`);
  console.log(
    `lignes=${outcome.rowsScanned} source=${outcome.source} sexe=${outcome.detectedSex ?? "?"} ` +
      `âge=${outcome.detectedAge ?? "?"} prélèvement=${outcome.sampleDate ?? "?"} labo=${outcome.labName ?? "?"}`,
  );
  console.log(`${outcome.results.length} marqueurs reconnus :`);
  for (const r of outcome.results) {
    const ref =
      r.refLow !== undefined && r.refHigh !== undefined
        ? `[${r.refLow} – ${r.refHigh}]`
        : r.refHigh !== undefined
          ? `[< ${r.refHigh}]`
          : r.refLow !== undefined
            ? `[> ${r.refLow}]`
            : "[pas de norme imprimée]";
    const known = r.markerKey ? "" : "   << NON RÉPERTORIÉ";
    console.log(`  ${r.label.padEnd(48)} ${String(r.value).padStart(8)} ${r.unit.padEnd(14)} ${ref}${known}`);
  }
}
