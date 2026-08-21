"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Formulaire de mot de passe maître, partagé par la création et le déverrouillage. */
export default function PasswordForm({
  endpoint,
  submitLabel,
  withConfirmation = false,
  minLength = 1,
}: {
  endpoint: string;
  submitLabel: string;
  withConfirmation?: boolean;
  minLength?: number;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
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
        <input
          id="password"
          type="password"
          className="bloo-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={minLength}
          required
          autoFocus
          autoComplete={withConfirmation ? "new-password" : "current-password"}
        />
      </div>

      {withConfirmation && (
        <div>
          <label className="bloo-label" htmlFor="confirmation">
            Confirme le mot de passe
          </label>
          <input
            id="confirmation"
            type="password"
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
