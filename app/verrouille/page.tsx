import { redirect } from "next/navigation";
import Bloo from "@/components/Bloo";
import PasswordForm from "@/components/PasswordForm";
import { isVaultInitialised } from "@/lib/db";
import { getSessionKey } from "@/lib/session";

export default async function Verrouille() {
  if (!isVaultInitialised()) redirect("/bienvenue");
  if (await getSessionKey()) redirect("/accueil");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <Bloo size="lg" />
        <h1 className="mt-4 text-2xl font-extrabold text-blush-800">Content de te revoir !</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Ton espace est verrouillé. Entre ton mot de passe pour retrouver tes analyses.
        </p>
      </div>

      <div className="bloo-card">
        <PasswordForm endpoint="/api/vault/unlock" submitLabel="Déverrouiller" />
      </div>
    </main>
  );
}
