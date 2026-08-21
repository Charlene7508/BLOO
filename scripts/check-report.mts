import fs from "node:fs";
import { extractFromPdf } from "@/lib/parsing/extract";
import { evaluateAll } from "@/lib/analysis/status";
import { buildReport } from "@/lib/analysis/report";

const outcome = await extractFromPdf(new Uint8Array(fs.readFileSync(process.argv[2])));
const evaluated = evaluateAll(
  outcome.results.map((r) => ({
    markerKey: r.markerKey,
    value: r.value,
    unit: r.unit,
    refLow: r.refLow,
    refHigh: r.refHigh,
  })),
  outcome.detectedSex,
);
const report = buildReport(evaluated);

console.log(`source=${outcome.source}  sexe=${outcome.detectedSex ?? "?"}\n`);
console.log("RÉSUMÉ :", JSON.stringify(report.summary));
console.log("\n" + report.headline + "\n");
for (const s of report.sections) {
  console.log(`\n## ${s.title}  [${s.tone}]`);
  for (const p of s.paragraphs) console.log("   " + p);
  for (const n of s.notes ?? []) {
    const bornes = n.low !== undefined && n.high !== undefined ? `${n.low}–${n.high}` : n.high !== undefined ? `< ${n.high}` : n.low !== undefined ? `> ${n.low}` : "?";
    console.log(`   • ${n.label} : ${n.value} ${n.unit} (norme ${bornes}) → ${n.status.toUpperCase()}${n.marked ? " nettement" : ""}`);
    console.log(`     ${n.text.slice(0, 150)}…`);
  }
  for (const p of s.patterns ?? []) console.log(`   ▸ ${p.title}\n     ${p.text.slice(0, 160)}…`);
  if (s.chips) console.log("   " + s.chips.join(" · "));
}
console.log("\n## Questions à poser");
for (const q of report.questions) console.log("   ? " + q);
