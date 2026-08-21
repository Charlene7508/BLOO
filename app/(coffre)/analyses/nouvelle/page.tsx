import NewAnalysisFlow from "@/components/NewAnalysisFlow";
import { MARKERS } from "@/lib/markers/catalog";

export default function NouvelleAnalyse() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-blush-800">Décoder une analyse</h1>
        <p className="text-sm text-ink-soft">
          Dépose ton compte rendu en PDF. Il est lu sur cette machine, jamais envoyé ailleurs.
        </p>
      </div>

      <NewAnalysisFlow
        catalog={MARKERS.map((m) => ({
          key: m.key,
          label: m.label,
          unit: m.unit,
          category: m.category,
        }))}
      />
    </div>
  );
}
