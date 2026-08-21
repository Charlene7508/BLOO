"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAnalysisButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function remove() {
    setPending(true);
    const response = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
    setPending(false);
    if (response.ok) router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full px-3 py-1.5 text-xs font-bold text-ink-soft transition hover:bg-alert-bg hover:text-alert"
        aria-label={`Supprimer l'analyse ${title}`}
      >
        Supprimer
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className="font-semibold text-ink-soft">Définitivement ?</span>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="rounded-full bg-alert px-3 py-1.5 font-bold text-white disabled:opacity-50"
      >
        Oui
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full px-2 py-1.5 font-bold text-ink-soft"
      >
        Non
      </button>
    </span>
  );
}
