import { redirect } from "next/navigation";
import Bloo from "@/components/Bloo";
import PasswordForm from "@/components/PasswordForm";
import { isVaultInitialised } from "@/lib/db";
import { MIN_PASSWORD_LENGTH } from "@/lib/vault";

export default function Bienvenue() {
  if (isVaultInitialised()) redirect("/verrouille");

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <Bloo size="xl" />
        <h1 className="mt-4 text-3xl font-extrabold text-blush-800">Bonjour, moi c&apos;est Bloo !</h1>
        <p className="mt-2 text-ink-soft">
          Je me charge d&apos;analyser et de conserver précieusement toutes tes analyses de sang !
        </p>
      </div>

      <div className="bloo-card">
        <h2 className="text-lg font-bold text-blush-800">Créer ton espace</h2>
        <p className="mt-2 mb-5 text-sm text-ink-soft">
          Ceci est un mini coffre-fort qui contient des données sensibles qui te sont propres, il
          se doit donc d&apos;être protégé efficacement ! Par conséquent, ton mot de passe doit
          être robuste et il ne pourra être réinitialisé si tu le perds donc note-le en lieu sûr.{" "}
          <strong className="text-blush-700">Si tu l&apos;oublies, tes analyses seront perdues.</strong>
        </p>
        <PasswordForm
          endpoint="/api/vault/setup"
          submitLabel="Créer mon espace"
          withConfirmation
          minLength={MIN_PASSWORD_LENGTH}
        />
        <p className="mt-4 text-xs text-ink-soft">
          {MIN_PASSWORD_LENGTH} caractères minimum. Une phrase dont tu te souviens fait un excellent
          mot de passe.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        Bloo ne remplace pas un avis médical. Ses explications sont informatives.
      </p>
    </main>
  );
}
