import Link from "next/link";
import Bloo from "@/components/Bloo";
import { listAnalyses } from "@/lib/analyses";
import { MARKERS } from "@/lib/markers/catalog";
import { ageFromProfile, loadProfile } from "@/lib/profile";
import { getSessionKey } from "@/lib/session";

export default async function Accueil() {
  const key = (await getSessionKey())!;
  const analyses = listAnalyses(key);
  const profile = loadProfile(key);
  const profileComplete = Boolean(profile.sex && profile.birthYear);
  const derniere = analyses[0];

  return (
    <div className="space-y-6">
      <section className="bloo-card flex flex-wrap items-center gap-5">
        <Bloo size="lg" className="shrink-0" />
        <div className="min-w-60 flex-1">
          <h1 className="text-2xl font-extrabold text-blush-800">
            {analyses.length ? "Content de te revoir !" : "Prête à décoder ta première analyse ?"}
          </h1>
          <p className="mt-2 text-ink-soft">
            Dépose ton compte rendu de laboratoire : je repère les marqueurs, je te dis lesquels
            sortent des normes, et je t&apos;explique ce que cela peut vouloir dire.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/analyses/nouvelle" className="bloo-btn">
              Décoder une analyse
            </Link>
            <Link href="/glossaire" className="bloo-btn-soft">
              Explorer le glossaire
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bloo-card">
          <p className="text-3xl font-extrabold text-blush-700">{analyses.length}</p>
          <p className="text-sm text-ink-soft">
            analyse{analyses.length > 1 ? "s" : ""} dans ton coffre
          </p>
        </div>
        <div className="bloo-card">
          <p className="text-3xl font-extrabold text-blush-700">{MARKERS.length}</p>
          <p className="text-sm text-ink-soft">marqueurs expliqués au glossaire</p>
        </div>
        <div className="bloo-card">
          <p className="text-3xl font-extrabold text-blush-700">
            {profileComplete ? "✓" : "—"}
          </p>
          <p className="text-sm text-ink-soft">
            {profileComplete ? (
              <>profil complété {ageFromProfile(profile) ? `(${ageFromProfile(profile)} ans)` : ""}</>
            ) : (
              <Link href="/profil" className="font-bold text-blush-700 underline">
                complète ton profil pour affiner les normes
              </Link>
            )}
          </p>
        </div>
      </div>

      {derniere && (
        <section className="bloo-card">
          <h2 className="text-base font-extrabold text-blush-800">Ta dernière analyse</h2>
          <Link
            href={`/analyses/${derniere.id}`}
            className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-blush-50/60 px-4 py-3 transition hover:bg-blush-100/70"
          >
            <span className="font-bold text-ink">{derniere.title}</span>
            <span className="text-sm text-ink-soft">
              {derniere.report.summary.outOfRange === 0
                ? "tout est dans les normes"
                : `${derniere.report.summary.outOfRange} marqueur${derniere.report.summary.outOfRange > 1 ? "s" : ""} hors norme`}
            </span>
          </Link>
        </section>
      )}

      <section className="bloo-card">
        <h2 className="text-base font-extrabold text-blush-800">Tes données restent chez toi</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Les documents et les résultats sont chiffrés sur cette machine avec ton mot de passe
          maître. Bloo lit les PDF en local et rédige ses explications hors ligne : rien n&apos;est
          envoyé sur Internet.
        </p>
      </section>
    </div>
  );
}
