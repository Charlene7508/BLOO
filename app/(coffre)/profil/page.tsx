import ProfileForm from "@/components/ProfileForm";
import { loadProfile } from "@/lib/profile";
import { getSessionKey } from "@/lib/session";

export default async function Profil() {
  const key = (await getSessionKey())!;
  const profile = loadProfile(key);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-blush-800">Mon profil</h1>
        <p className="text-sm text-ink-soft">
          Ces informations affinent la lecture de tes résultats : plusieurs normes diffèrent selon
          le sexe, et le contexte change le sens d&apos;un écart. Tout est chiffré avec le reste.
        </p>
      </div>
      <ProfileForm initial={profile} />
    </div>
  );
}
