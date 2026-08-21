import Link from "next/link";
import Bloo from "@/components/Bloo";
import StatusBadge from "@/components/StatusBadge";
import type { Report } from "@/lib/analysis/report";
import { MARKERS_BY_KEY } from "@/lib/markers/catalog";

function formatRange(low?: number, high?: number): string {
  if (low !== undefined && high !== undefined) return `${low} – ${high}`;
  if (high !== undefined) return `< ${high}`;
  if (low !== undefined) return `> ${low}`;
  return "non précisée";
}

const TONE_RING: Record<string, string> = {
  good: "border-l-4 border-l-ok",
  watch: "border-l-4 border-l-alert",
  neutral: "border-l-4 border-l-blush-300",
};

/** Rendu du compte rendu global : synthèse, écarts, recoupements, questions. */
export default function ReportView({ report }: { report: Report }) {
  return (
    <div className="space-y-5">
      <section className="bloo-card flex gap-4">
        <Bloo size="md" className="shrink-0" />
        <div>
          <h2 className="text-lg font-extrabold text-blush-800">Ce que Bloo retient</h2>
          <p className="mt-2 text-ink">{report.headline}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-sand px-3 py-1 text-ink-soft">
              {report.summary.total} marqueurs
            </span>
            <span className="rounded-full bg-ok-bg px-3 py-1 text-ok">
              {report.summary.normal} dans la norme
            </span>
            {report.summary.outOfRange > 0 && (
              <span className="rounded-full bg-alert-bg px-3 py-1 text-alert">
                {report.summary.outOfRange} hors norme
              </span>
            )}
          </div>
        </div>
      </section>

      {report.sections.map((section) => (
        <section key={section.id} className={`bloo-card ${TONE_RING[section.tone] ?? ""}`}>
          <h3 className="text-base font-extrabold text-blush-800">{section.title}</h3>

          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-2 text-sm text-ink-soft">
              {paragraph}
            </p>
          ))}

          {section.notes && (
            <ul className="mt-4 space-y-4">
              {section.notes.map((note) => (
                <li key={note.markerKey ?? note.label} className="rounded-2xl bg-blush-50/60 p-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {note.markerKey ? (
                      <Link
                        href={`/glossaire/${note.markerKey}`}
                        className="font-bold text-blush-800 underline decoration-blush-200 underline-offset-4 hover:decoration-blush-500"
                      >
                        {note.label}
                      </Link>
                    ) : (
                      // Hors catalogue : pas de fiche de glossaire vers laquelle pointer.
                      <span className="font-bold text-blush-800">{note.label}</span>
                    )}
                    <span className="text-lg font-extrabold text-ink">
                      {note.value} {note.unit}
                    </span>
                    <span className="text-xs text-ink-soft">
                      norme : {formatRange(note.low, note.high)}
                    </span>
                    <StatusBadge status={note.status} marked={note.marked} />
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{note.text}</p>
                </li>
              ))}
            </ul>
          )}

          {section.patterns && (
            <ul className="mt-4 space-y-4">
              {section.patterns.map((pattern) => (
                <li key={pattern.id} className="rounded-2xl bg-blush-50/60 p-4">
                  <p className="font-bold text-blush-800">{pattern.title}</p>
                  <p className="mt-1.5 text-sm text-ink-soft">{pattern.text}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {pattern.markers.map((key) => (
                      <Link
                        key={key}
                        href={`/glossaire/${key}`}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-blush-700 hover:bg-blush-100"
                      >
                        {MARKERS_BY_KEY[key]?.label ?? key}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {section.chips && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {section.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink-soft">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </section>
      ))}

      {report.questions.length > 0 && (
        <section className="bloo-card border-l-4 border-l-blush-400">
          <h3 className="text-base font-extrabold text-blush-800">
            À emporter chez ton médecin
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            Quelques questions que ces résultats rendent utiles à poser.
          </p>
          <ul className="mt-3 space-y-2">
            {report.questions.map((question) => (
              <li key={question} className="flex gap-2 text-sm text-ink">
                <span aria-hidden className="text-blush-500">?</span>
                {question}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="rounded-3xl bg-sand/70 px-5 py-4 text-xs leading-relaxed text-ink-soft">
        {report.disclaimer}
      </p>
    </div>
  );
}
