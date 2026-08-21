import GlossaryBrowser from "@/components/GlossaryBrowser";
import { MARKERS } from "@/lib/markers/catalog";

export default function Glossaire() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-blush-800">Glossaire</h1>
        <p className="text-sm text-ink-soft">
          {MARKERS.length} marqueurs expliqués simplement : à quoi ils servent, et ce qu&apos;une
          valeur trop haute ou trop basse peut traduire.
        </p>
      </div>

      <GlossaryBrowser
        markers={MARKERS.map((m) => ({
          key: m.key,
          label: m.label,
          category: m.category,
          about: m.about,
        }))}
      />
    </div>
  );
}
