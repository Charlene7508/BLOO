"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_LABELS, type MarkerCategory } from "@/lib/markers/types";

interface Entry {
  key: string;
  label: string;
  category: string;
  about: string;
}

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Liste filtrable du glossaire, regroupée par famille de marqueurs. */
export default function GlossaryBrowser({ markers }: { markers: Entry[] }) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const needle = normalize(query.trim());
    const matching = needle
      ? markers.filter(
          (m) => normalize(m.label).includes(needle) || normalize(m.about).includes(needle),
        )
      : markers;

    const groups = new Map<string, Entry[]>();
    for (const marker of matching) {
      if (!groups.has(marker.category)) groups.set(marker.category, []);
      groups.get(marker.category)!.push(marker);
    }
    return [...groups.entries()];
  }, [markers, query]);

  return (
    <div className="space-y-5">
      <input
        type="search"
        className="bloo-input"
        placeholder="Chercher un marqueur : ferritine, TSH, cholestérol…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Chercher un marqueur"
      />

      {!grouped.length && (
        <p className="bloo-card text-center text-ink-soft">
          Aucun marqueur ne correspond à « {query} ».
        </p>
      )}

      {grouped.map(([category, entries]) => (
        <section key={category} className="bloo-card">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-blush-600">
            {CATEGORY_LABELS[category as MarkerCategory] ?? category}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {entries.map((marker) => (
              <li key={marker.key}>
                <Link
                  href={`/glossaire/${marker.key}`}
                  className="block rounded-2xl bg-blush-50/60 px-4 py-3 transition hover:bg-blush-100/80"
                >
                  <span className="font-bold text-blush-800">{marker.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                    {marker.about.slice(0, 96)}…
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
