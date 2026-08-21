import Link from "next/link";
import Bloo from "@/components/Bloo";
import DeleteAnalysisButton from "@/components/DeleteAnalysisButton";
import { listAnalyses } from "@/lib/analyses";
import { getSessionKey } from "@/lib/session";

function formatDate(iso: string | undefined): string {
  if (!iso) return "date inconnue";
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export default async function MesAnalyses() {
  const key = (await getSessionKey())!;
  const analyses = listAnalyses(key);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-blush-800">Mes analyses</h1>
          <p className="text-sm text-ink-soft">
            {analyses.length
              ? `${analyses.length} analyse${analyses.length > 1 ? "s" : ""} conservée${analyses.length > 1 ? "s" : ""} dans ton coffre chiffré.`
              : "Ton coffre est encore vide."}
          </p>
        </div>
        <Link href="/analyses/nouvelle" className="bloo-btn">
          Décoder une analyse
        </Link>
      </div>

      {!analyses.length && (
        <div className="bloo-card flex flex-col items-center gap-3 py-10 text-center">
          <Bloo size="lg" />
          <p className="max-w-sm text-ink-soft">
            Dépose ton premier compte rendu de laboratoire et je m&apos;occupe du reste.
          </p>
          <Link href="/analyses/nouvelle" className="bloo-btn">
            Commencer
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {analyses.map((analysis) => {
          const { outOfRange, total } = analysis.report.summary;
          return (
            <li key={analysis.id} className="bloo-card flex flex-wrap items-center gap-4">
              <div className="min-w-52 flex-1">
                <Link
                  href={`/analyses/${analysis.id}`}
                  className="text-lg font-bold text-blush-800 hover:underline"
                >
                  {analysis.title}
                </Link>
                <p className="text-sm text-ink-soft">
                  Prélèvement du {formatDate(analysis.sampleDate ?? analysis.createdAt)}
                  {analysis.labName ? ` · ${analysis.labName}` : ""}
                  {analysis.source === "ocr" ? " · lu par reconnaissance optique" : ""}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    outOfRange === 0 ? "bg-ok-bg text-ok" : "bg-alert-bg text-alert"
                  }`}
                >
                  {outOfRange === 0 ? "tout est normal" : `${outOfRange} / ${total} hors norme`}
                </span>
                <DeleteAnalysisButton id={analysis.id} title={analysis.title} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
