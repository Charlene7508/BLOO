import { redirect } from "next/navigation";
import { isVaultInitialised } from "@/lib/db";
import { getSessionKey } from "@/lib/session";

/** Point d'entrée : oriente selon l'état du coffre. */
export default async function Home() {
  if (!isVaultInitialised()) redirect("/bienvenue");
  if (!(await getSessionKey())) redirect("/verrouille");
  redirect("/accueil");
}
