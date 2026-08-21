"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Bloo from "@/components/Bloo";
import { CATEGORY_LABELS, type MarkerCategory } from "@/lib/markers/types";

interface CatalogEntry {
  key: string;
  label: string;
  unit: string;
  category: string;
}

interface DraftResult {
  /** `null` pour une mesure absente du catalogue de Bloo. */
  markerKey: string | null;
  label: string;
  value: string;
  unit: string;
  refLow: string;
  refHigh: string;
}

interface ExtractionResponse {
  uploadId?: string;
  originalFileName?: string;
  source: "texte" | "ocr";
  sampleDate?: string;
  labName?: string;
  results: {
    markerKey: string | null;
    label: string;
    value: number;
    unit: string;
    refLow?: number;
    refHigh?: number;
  }[];
}

type Step = "depot" | "lecture" | "verification";

const numberOrEmpty = (n: number | undefined) => (n === undefined ? "" : String(n));

export default function NewAnalysisFlow({ catalog }: { catalog: CatalogEntry[] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("depot");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [source, setSource] = useState<"texte" | "ocr" | "manuel">("manuel");
  const [uploadId, setUploadId] = useState<string | undefined>();
  const [originalFileName, setOriginalFileName] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [sampleDate, setSampleDate] = useState("");
  const [labName, setLabName] = useState("");
  const [results, setResults] = useState<DraftResult[]>([]);
  const [addKey, setAddKey] = useState("");

  const catalogByKey = useMemo(
    () => new Map(catalog.map((entry) => [entry.key, entry])),
    [catalog],
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, CatalogEntry[]>();
    for (const entry of catalog) {
      if (!groups.has(entry.category)) groups.set(entry.category, []);
      groups.get(entry.category)!.push(entry);
    }
    return [...groups.entries()];
  }, [catalog]);

  async function handleFile(file: File) {
    setError(null);
    setStep("lecture");

    const body = new FormData();
    body.append("fichier", file);

    try {
      const response = await fetch("/api/analyses/extract", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Bloo n'a pas réussi à lire ce document.");
        setStep("depot");
        return;
      }

      const extraction = data as ExtractionResponse;
      setSource(extraction.source);
      setUploadId(extraction.uploadId);
      setOriginalFileName(extraction.originalFileName);
      setSampleDate(extraction.sampleDate ?? "");
      setLabName(extraction.labName ?? "");
      setTitle(
        extraction.sampleDate
          ? `Analyse du ${extraction.sampleDate.split("-").reverse().join("/")}`
          : file.name.replace(/\.pdf$/i, ""),
      );
      setResults(
        extraction.results.map((r) => ({
          markerKey: r.markerKey,
          label: r.label,
          value: String(r.value),
          unit: r.unit,
          refLow: numberOrEmpty(r.refLow),
          refHigh: numberOrEmpty(r.refHigh),
        })),
      );
      setStep("verification");
    } catch {
      setError("La lecture a échoué. Réessaie, ou saisis tes résultats à la main.");
      setStep("depot");
    }
  }

  function startManual() {
    setSource("manuel");
    setResults([]);
    setTitle(`Analyse du ${new Date().toLocaleDateString("fr-FR")}`);
    setStep("verification");
  }

  const uncatalogued = results.filter((r) => r.markerKey === null).length;

  function updateResult(index: number, field: keyof DraftResult, value: string) {
    setResults((current) =>
      current.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  function addResult() {
    const entry = catalogByKey.get(addKey);
    if (!entry) return;
    if (results.some((r) => r.markerKey === entry.key)) return;
    setResults((current) => [
      ...current,
      { markerKey: entry.key, label: entry.label, value: "", unit: entry.unit, refLow: "", refHigh: "" },
    ]);
    setAddKey("");
  }

  async function save() {
    setError(null);

    const parsed = results
      .map((r) => ({
        markerKey: r.markerKey,
        label: r.label,
        value: Number(r.value.replace(",", ".")),
        unit: r.unit.trim(),
        refLow: r.refLow.trim() ? Number(r.refLow.replace(",", ".")) : undefined,
        refHigh: r.refHigh.trim() ? Number(r.refHigh.replace(",", ".")) : undefined,
      }))
      .filter((r) => Number.isFinite(r.value));

    if (!parsed.length) {
      setError("Ajoute au moins un résultat chiffré avant d'enregistrer.");
      return;
    }

    setSaving(true);
    const response = await fetch("/api/analyses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || "Analyse sans titre",
        sampleDate: /^\d{4}-\d{2}-\d{2}$/.test(sampleDate) ? sampleDate : undefined,
        labName: labName.trim() || undefined,
        source,
        uploadId,
        originalFileName,
        results: parsed,
      }),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data.error ?? "L'enregistrement a échoué.");
      return;
    }
    router.push(`/analyses/${data.id}`);
    router.refresh();
  }

  if (step === "lecture") {
    return (
      <div className="bloo-card flex flex-col items-center gap-3 py-12 text-center">
        <Bloo size="lg" className="animate-pulse" />
        <p className="text-lg font-bold text-blush-800">Je lis ton compte rendu…</p>
        <p className="max-w-sm text-sm text-ink-soft">
          Si le document est un scan, je le déchiffre caractère par caractère : cela peut prendre
          une trentaine de secondes. Tout se passe sur ta machine.
        </p>
      </div>
    );
  }

  if (step === "depot") {
    return (
      <div className="space-y-4">
        <label
          className="bloo-card flex cursor-pointer flex-col items-center gap-3 border-2 border-dashed border-blush-200 py-12 text-center transition hover:border-blush-400 hover:bg-blush-50/50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) void handleFile(file);
          }}
        >
          <Bloo size="lg" />
          <span className="text-lg font-bold text-blush-800">
            Dépose ton PDF ici, ou clique pour le choisir
          </span>
          <span className="max-w-sm text-sm text-ink-soft">
            PDF uniquement, 25 Mo maximum. Les scans et les photos de compte rendu sont acceptés :
            je les lis par reconnaissance optique.
          </span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-2xl bg-alert-bg px-4 py-3 text-sm font-semibold text-alert">
            {error}
          </p>
        )}

        <p className="text-center text-sm text-ink-soft">
          Pas de PDF sous la main ?{" "}
          <button type="button" onClick={startManual} className="font-bold text-blush-700 underline">
            Saisis tes résultats à la main
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="bloo-card">
        <div className="flex gap-4">
          <Bloo size="md" className="hidden shrink-0 sm:block" />
          <div>
            <h2 className="text-lg font-extrabold text-blush-800">
              {source === "manuel"
                ? "Saisis tes résultats"
                : `J'ai trouvé ${results.length} marqueur${results.length > 1 ? "s" : ""}`}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {source === "ocr"
                ? "Ton document était un scan : je l'ai lu par reconnaissance optique, une technique qui se trompe parfois. Vérifie chaque valeur avant d'enregistrer."
                : "Vérifie les valeurs, corrige ce qui a mal été lu, et ajoute ce que j'aurais manqué."}
            </p>
          </div>
        </div>
      </section>

      <section className="bloo-card grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label className="bloo-label" htmlFor="title">Titre de l&apos;analyse</label>
          <input
            id="title"
            className="bloo-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>
        <div>
          <label className="bloo-label" htmlFor="sampleDate">Date de prélèvement</label>
          <input
            id="sampleDate"
            type="date"
            className="bloo-input"
            value={sampleDate}
            onChange={(e) => setSampleDate(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="bloo-label" htmlFor="labName">Laboratoire</label>
          <input
            id="labName"
            className="bloo-input"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            maxLength={120}
          />
        </div>
      </section>

      <section className="bloo-card">
        <h3 className="mb-3 text-base font-extrabold text-blush-800">Résultats</h3>

        {uncatalogued > 0 && (
          <p className="mb-3 rounded-2xl bg-watch-bg px-4 py-3 text-sm text-watch">
            {uncatalogued === 1
              ? "1 mesure ne figure pas encore au catalogue de Bloo."
              : `${uncatalogued} mesures ne figurent pas encore au catalogue de Bloo.`}{" "}
            Elles sont conservées et situées par rapport à la norme de ton laboratoire, mais Bloo ne
            saura pas encore les expliquer. Tu peux corriger leur nom, ou les retirer.
          </p>
        )}

        {!results.length && (
          <p className="rounded-2xl bg-sand/70 px-4 py-3 text-sm text-ink-soft">
            Aucun résultat pour l&apos;instant. Ajoute-les un par un ci-dessous.
          </p>
        )}

        <ul className="space-y-3">
          {results.map((result, index) => (
            <li key={result.markerKey ?? `libre-${index}`} className="rounded-2xl bg-blush-50/60 p-3">
              <div className="flex flex-wrap items-end gap-2">
                {result.markerKey ? (
                  <span className="min-w-44 flex-1 pb-2 font-bold text-blush-800">{result.label}</span>
                ) : (
                  <div className="min-w-44 flex-1">
                    <label className="bloo-label" htmlFor={`label-${index}`}>
                      Nom lu sur le compte rendu
                    </label>
                    <input
                      id={`label-${index}`}
                      className="bloo-input px-3 py-2"
                      value={result.label}
                      onChange={(e) => updateResult(index, "label", e.target.value)}
                    />
                    <span className="mt-1 inline-block rounded-full bg-watch-bg px-2 py-0.5 text-xs font-bold text-watch">
                      hors catalogue
                    </span>
                  </div>
                )}

                <div className="w-24">
                  <label className="bloo-label" htmlFor={`value-${index}`}>Valeur</label>
                  <input
                    id={`value-${index}`}
                    inputMode="decimal"
                    className="bloo-input px-3 py-2"
                    value={result.value}
                    onChange={(e) => updateResult(index, "value", e.target.value)}
                  />
                </div>

                <div className="w-24">
                  <label className="bloo-label" htmlFor={`unit-${index}`}>Unité</label>
                  <input
                    id={`unit-${index}`}
                    className="bloo-input px-3 py-2"
                    value={result.unit}
                    onChange={(e) => updateResult(index, "unit", e.target.value)}
                  />
                </div>

                <div className="w-24">
                  <label className="bloo-label" htmlFor={`low-${index}`}>Norme min</label>
                  <input
                    id={`low-${index}`}
                    inputMode="decimal"
                    className="bloo-input px-3 py-2"
                    value={result.refLow}
                    onChange={(e) => updateResult(index, "refLow", e.target.value)}
                  />
                </div>

                <div className="w-24">
                  <label className="bloo-label" htmlFor={`high-${index}`}>Norme max</label>
                  <input
                    id={`high-${index}`}
                    inputMode="decimal"
                    className="bloo-input px-3 py-2"
                    value={result.refHigh}
                    onChange={(e) => updateResult(index, "refHigh", e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setResults((c) => c.filter((_, i) => i !== index))}
                  className="mb-1 rounded-full px-3 py-1.5 text-xs font-bold text-ink-soft transition hover:bg-alert-bg hover:text-alert"
                  aria-label={`Retirer ${result.label}`}
                >
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-blush-100 pt-4">
          <div className="min-w-60 flex-1">
            <label className="bloo-label" htmlFor="addMarker">Ajouter un marqueur</label>
            <select
              id="addMarker"
              className="bloo-input"
              value={addKey}
              onChange={(e) => setAddKey(e.target.value)}
            >
              <option value="">Choisir un marqueur…</option>
              {grouped.map(([category, entries]) => (
                <optgroup key={category} label={CATEGORY_LABELS[category as MarkerCategory] ?? category}>
                  {entries.map((entry) => (
                    <option
                      key={entry.key}
                      value={entry.key}
                      disabled={results.some((r) => r.markerKey === entry.key)}
                    >
                      {entry.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button type="button" onClick={addResult} disabled={!addKey} className="bloo-btn-soft">
            Ajouter
          </button>
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-2xl bg-alert-bg px-4 py-3 text-sm font-semibold text-alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={save} disabled={saving} className="bloo-btn">
          {saving ? "J'analyse…" : "Enregistrer et décoder"}
        </button>
        <button type="button" onClick={() => setStep("depot")} className="bloo-btn-soft">
          Recommencer
        </button>
      </div>
    </div>
  );
}
