import Link from "next/link";
import { notFound } from "next/navigation";
import ReportView from "@/components/ReportView";
import { getAnalysis } from "@/lib/analyses";
import { getSessionKey } from "@/lib/session";

export default async function FicheAnalyse({ params }: { params: Promise<{ id: string }> }) {
  const key = (await getSessionKey())!;
  const analysis = getAnalysis(key, (await params).id);
  if (!analysis) notFound();

  return (
    <div className="space-y-5">
      <div>
        <Link href="/analyses" className="text-sm font-bold text-blush-700 hover:underline">
          ← Mes analyses
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-blush-800">{analysis.title}</h1>
        <p className="text-sm text-ink-soft">
          {analysis.sampleDate ? `Prélèvement du ${analysis.sampleDate.split("-").reverse().join("/")}` : "Date de prélèvement inconnue"}
          {analysis.labName ? ` · ${analysis.labName}` : ""}
        </p>
        {analysis.source === "ocr" && (
          <p className="mt-3 rounded-2xl bg-watch-bg px-4 py-3 text-sm text-watch">
            Ce document était un scan : les valeurs ont été lues par reconnaissance optique, une
            technique qui se trompe parfois. Compare-les à ton compte rendu papier avant d&apos;en
            tirer des conclusions.
          </p>
        )}
      </div>

      <ReportView report={analysis.report} />
    </div>
  );
}
