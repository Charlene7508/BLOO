import Link from "next/link";
import { notFound } from "next/navigation";
import Bloo from "@/components/Bloo";
import { MARKERS_BY_KEY } from "@/lib/markers/catalog";
import { CATEGORY_LABELS } from "@/lib/markers/types";

export default async function FicheMarqueur({ params }: { params: Promise<{ key: string }> }) {
  const marker = MARKERS_BY_KEY[(await params).key];
  if (!marker) notFound();

  return (
    <div className="space-y-5">
      <div>
        <Link href="/glossaire" className="text-sm font-bold text-blush-700 hover:underline">
          ← Glossaire
        </Link>
        <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-blush-600">
          {CATEGORY_LABELS[marker.category]}
        </p>
        <h1 className="text-2xl font-extrabold text-blush-800">{marker.label}</h1>
      </div>

      <section className="bloo-card flex gap-4">
        <Bloo size="md" className="hidden shrink-0 sm:block" />
        <div>
          <h2 className="text-base font-extrabold text-blush-800">À quoi ça sert ?</h2>
          <p className="mt-2 text-ink">{marker.about}</p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="bloo-card border-l-4 border-l-alert">
          <h2 className="text-base font-extrabold text-alert">Si la valeur est au-dessus</h2>
          <p className="mt-2 text-sm text-ink-soft">{marker.high}</p>
        </section>
        <section className="bloo-card border-l-4 border-l-watch">
          <h2 className="text-base font-extrabold text-watch">Si la valeur est en dessous</h2>
          <p className="mt-2 text-sm text-ink-soft">{marker.low}</p>
        </section>
      </div>

      <section className="bloo-card">
        <h2 className="text-base font-extrabold text-blush-800">Repères de référence</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Repères adultes indicatifs. Bloo utilise toujours en priorité l&apos;intervalle imprimé sur
          ton compte rendu : les normes varient selon la technique du laboratoire.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {marker.ranges.map((range, index) => (
            <li key={index} className="flex flex-wrap gap-2 text-ink">
              <span className="font-bold">
                {range.low !== undefined && range.high !== undefined
                  ? `${range.low} – ${range.high}`
                  : range.high !== undefined
                    ? `< ${range.high}`
                    : `> ${range.low}`}
              </span>
              <span className="text-ink-soft">{range.unit}</span>
              {range.sex && (
                <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-bold text-ink-soft">
                  {range.sex === "F" ? "femme" : "homme"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-3xl bg-sand/70 px-5 py-4 text-xs leading-relaxed text-ink-soft">
        Ces explications sont informatives et générales. Elles ne remplacent pas l&apos;interprétation
        d&apos;un professionnel de santé, qui tient compte de ton histoire et de ton examen.
      </p>
    </div>
  );
}
