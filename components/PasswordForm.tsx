"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Formulaire de mot de passe maître, partagé par la création et le déverrouillage. */
export default function PasswordForm({
  endpoint,
  submitLabel,
  withConfirmation = false,
  minLength = 1,
  hint,
}: {
  endpoint: string;
  submitLabel: string;
  withConfirmation?: boolean;
  minLength?: number;
  /** Consigne affichée sous le champ, avant la frappe plutôt qu'après. */
  hint?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (withConfirmation && password !== confirmation) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      router.replace("/accueil");
      router.refresh();
    } catch {
      setError("Bloo n'a pas réussi à joindre le serveur.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="bloo-label" htmlFor="password">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            type={visible ? "text" : "password"}
            className="bloo-input pr-24"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={minLength}
            required
            autoFocus
            autoComplete={withConfirmation ? "new-password" : "current-password"}
            aria-describedby={hint ? "password-hint" : undefined}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            className="absolute inset-y-0 right-2 my-1 rounded-full px-3 text-xs font-bold text-blush-700
                       transition hover:bg-blush-50 focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-blush-600"
          >
            {visible ? "Masquer" : "Afficher"}
          </button>
        </div>
        {hint && (
          <p id="password-hint" className="mt-2 text-xs text-ink-soft">
            {hint}
          </p>
        )}
      </div>

      {withConfirmation && (
        <div>
          <label className="bloo-label" htmlFor="confirmation">
            Confirme le mot de passe
          </label>
          <input
            id="confirmation"
            type={visible ? "text" : "password"}
            className="bloo-input"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-2xl bg-alert-bg px-4 py-3 text-sm font-semibold text-alert">
          {error}
        </p>
      )}

      <button type="submit" className="bloo-btn w-full" disabled={pending}>
        {pending ? "Un instant…" : submitLabel}
      </button>
    </form>
  );
}
