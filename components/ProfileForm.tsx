"use client";

import { useState } from "react";
import type { Profile } from "@/lib/profile";

/** Champs numériques : vide plutôt que 0 quand l'utilisateur n'a rien saisi. */
function toNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

export default function ProfileForm({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState<Profile>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof Profile>(field: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);

    // Les champs vides sont retirés : le schéma serveur les veut absents, pas nuls.
    const payload = Object.fromEntries(
      Object.entries(profile).filter(([, v]) => v !== undefined && v !== "" && v !== null),
    );

    const response = await fetch("/api/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("saved");
    } else {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error ?? "L'enregistrement a échoué.");
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <section className="bloo-card grid gap-4 sm:grid-cols-2">
        <div>
          <label className="bloo-label" htmlFor="sex">Sexe</label>
          <select
            id="sex"
            className="bloo-input"
            value={profile.sex ?? ""}
            onChange={(e) => update("sex", (e.target.value || undefined) as Profile["sex"])}
          >
            <option value="">Non précisé</option>
            <option value="F">Femme</option>
            <option value="M">Homme</option>
          </select>
          <p className="mt-1 text-xs text-ink-soft">
            Hémoglobine, ferritine, créatinine : leurs normes en dépendent.
          </p>
        </div>

        <div>
          <label className="bloo-label" htmlFor="birthYear">Année de naissance</label>
          <input
            id="birthYear"
            type="number"
            className="bloo-input"
            min={1900}
            max={new Date().getFullYear()}
            value={profile.birthYear ?? ""}
            onChange={(e) => update("birthYear", toNumber(e.target.value))}
          />
        </div>

        <div>
          <label className="bloo-label" htmlFor="heightCm">Taille (cm)</label>
          <input
            id="heightCm"
            type="number"
            className="bloo-input"
            value={profile.heightCm ?? ""}
            onChange={(e) => update("heightCm", toNumber(e.target.value))}
          />
        </div>

        <div>
          <label className="bloo-label" htmlFor="weightKg">Poids (kg)</label>
          <input
            id="weightKg"
            type="number"
            className="bloo-input"
            value={profile.weightKg ?? ""}
            onChange={(e) => update("weightKg", toNumber(e.target.value))}
          />
        </div>

        <div>
          <label className="bloo-label" htmlFor="activity">Activité physique</label>
          <select
            id="activity"
            className="bloo-input"
            value={profile.activity ?? ""}
            onChange={(e) => update("activity", (e.target.value || undefined) as Profile["activity"])}
          >
            <option value="">Non précisée</option>
            <option value="faible">Faible</option>
            <option value="moderee">Modérée</option>
            <option value="intense">Intense</option>
          </select>
          <p className="mt-1 text-xs text-ink-soft">
            Un effort intense fait monter les enzymes musculaires et hépatiques.
          </p>
        </div>

        <div>
          <label className="bloo-label" htmlFor="diet">Alimentation</label>
          <select
            id="diet"
            className="bloo-input"
            value={profile.diet ?? ""}
            onChange={(e) => update("diet", (e.target.value || undefined) as Profile["diet"])}
          >
            <option value="">Non précisée</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarien">Végétarienne</option>
            <option value="vegetalien">Végétalienne</option>
          </select>
          <p className="mt-1 text-xs text-ink-soft">
            Éclaire une vitamine B12 ou un fer bas.
          </p>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-blush-600)]"
            checked={profile.pregnant ?? false}
            onChange={(e) => update("pregnant", e.target.checked)}
          />
          Enceinte actuellement
        </label>

        <label className="flex items-center gap-2.5 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-blush-600)]"
            checked={profile.smoker ?? false}
            onChange={(e) => update("smoker", e.target.checked)}
          />
          Fumeuse ou fumeur
        </label>
      </section>

      <section className="bloo-card space-y-4">
        <div>
          <label className="bloo-label" htmlFor="treatments">Traitements en cours</label>
          <textarea
            id="treatments"
            className="bloo-input min-h-20"
            placeholder="Pilule, lévothyroxine, statine, fer…"
            value={profile.treatments ?? ""}
            onChange={(e) => update("treatments", e.target.value)}
          />
        </div>
        <div>
          <label className="bloo-label" htmlFor="conditions">Antécédents connus</label>
          <textarea
            id="conditions"
            className="bloo-input min-h-20"
            placeholder="Thyroïdite, anémie, hypertension…"
            value={profile.conditions ?? ""}
            onChange={(e) => update("conditions", e.target.value)}
          />
        </div>
        <div>
          <label className="bloo-label" htmlFor="notes">Notes libres</label>
          <textarea
            id="notes"
            className="bloo-input min-h-20"
            value={profile.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="bloo-btn" disabled={status === "saving"}>
          {status === "saving" ? "Enregistrement…" : "Enregistrer mon profil"}
        </button>
        {status === "saved" && <span className="text-sm font-bold text-ok">Profil enregistré ✓</span>}
        {status === "error" && <span className="text-sm font-bold text-alert">{message}</span>}
      </div>
    </form>
  );
}
