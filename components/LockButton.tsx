"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LockButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function lock() {
    setPending(true);
    await fetch("/api/vault/lock", { method: "POST" });
    router.replace("/verrouille");
    router.refresh();
  }

  return (
    <button type="button" onClick={lock} disabled={pending} className="bloo-btn-soft px-4 py-1.5 text-xs">
      Verrouiller
    </button>
  );
}
