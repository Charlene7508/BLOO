import Link from "next/link";
import { redirect } from "next/navigation";
import Bloo from "@/components/Bloo";
import LockButton from "@/components/LockButton";
import { isVaultInitialised } from "@/lib/db";
import { getSessionKey } from "@/lib/session";

const LINKS = [
  { href: "/accueil", label: "Accueil" },
  { href: "/analyses", label: "Mes analyses" },
  { href: "/glossaire", label: "Glossaire" },
  { href: "/profil", label: "Mon profil" },
];

/**
 * Rendu systématiquement à la demande : ces pages dépendent de la session et
 * du contenu chiffré, rien ici ne peut être pré-généré au build.
 */
export const dynamic = "force-dynamic";

/** Toutes les pages sous ce layout exigent un coffre déverrouillé. */
export default async function CoffreLayout({ children }: { children: React.ReactNode }) {
  if (!isVaultInitialised()) redirect("/bienvenue");
  if (!(await getSessionKey())) redirect("/verrouille");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-blush-100 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <Link href="/accueil" className="flex items-center gap-2">
            <Bloo size="sm" />
            <span className="text-xl font-extrabold tracking-tight text-blush-700">Bloo</span>
          </Link>

          <nav className="flex flex-1 flex-wrap items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-bold text-ink-soft transition hover:bg-blush-50 hover:text-blush-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <LockButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 text-center text-xs text-ink-soft">
        Bloo donne des explications informatives et ne remplace jamais l&apos;avis d&apos;un
        professionnel de santé.
      </footer>
    </div>
  );
}
