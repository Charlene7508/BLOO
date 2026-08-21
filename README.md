<div align="center">


# <img width="42" height="39" alt="Bloo_perso" src="https://github.com/user-attachments/assets/efec6004-1fb3-47ed-bdad-adbbd618ab05" /> BLOO

</div>

👀 Les résultats d'une prise de sang peuvent générer des inquiétudes si certains marqueurs sont en dehors des normes indiquées par le laboratoire, et il faut attendre d'avoir un rendez-vous chez le médecin pour lever celles-ci. 

👉 **Bloo** est là pour vous faire patienter en vous expliquant la signification de chaque marqueur et en vous donnant quelques pistes éventuelles qui pourraient expliquer votre résultat.
Toutes vos analyses resteront stockées en sécurité dans votre espace afin de vous permettre de les retrouver plus facilement avant vos rendez-vous médicaux.


*Les explications sont **informatives, jamais un diagnostic** : elles décrivent ce qu'un écart
*peut traduire*, au conditionnel, et renvoient au médecin.*

---

# 🔒 MINI-COFFRE FORT EN LOCAL

Aucune donnée de santé ne quitte l'ordinateur. L'analyse est lu localement (couche texte, ou OCR si le compte rendu est scanné), le compte rendu est rédigé localement, et tout est rangé dans un coffre chiffré : scrypt + AES-256-GCM, la clé n'existe qu'en mémoire, le temps de la session. Le modèle de langue de l'OCR est embarqué dans `vendor/` pour qu'aucun téléchargement ne soit nécessaire. Le dossier `data/` (base chiffrée et pièces jointes) n'est jamais versionné.

## Si un marqueur ne ressort pas
Bloo ne connaît que les marqueurs de son catalogue, et il ne va pas chercher les autres sur Internet — c'est délibéré pour des questions de sécurité. Si un ou plusieurs marqueurs manquent à l'appel, demande à une IA de les ajouter au programme. Si ce n'est pas possible pour différentes raisons, voici quoi faire :

**D'abord, regarde la fin du compte rendu.** Une ligne que Bloo n'a pas su nommer n'est jamais jetée en silence : dès que le laboratoire a imprimé une plage de référence, la mesure est conservée et affichée à part, avec sa valeur et sa position dans l'intervalle, mais sans explication. Si ton marqueur est là, il a bien été lu — il lui manque seulement sa fiche.

**Ensuite, vois ce que le parseur a extrait :**

```bash
npx tsx scripts/test-parsing.mts /chemin/vers/compte-rendu.pdf
```

Garde le PDF dans un dossier temporaire : un vrai compte rendu ne rentre jamais dans le dépôt.

Deux cas se présentent.

*La ligne apparaît, sans marqueur associé.* Le libellé du laboratoire ne fait partie d'aucun alias connu. Ajoute-le dans `lib/markers/catalog.ts` : soit comme alias supplémentaire d'un marqueur existant, soit comme nouvelle entrée complète (libellé, alias, catégorie, unité, plages de repli, textes du glossaire). Les accents et la ponctuation sont normalisés automatiquement — inutile de décliner `V.G.M.` et `vgm`. Méfie-toi en revanche des abréviations trop génériques : un alias court peut détourner un autre marqueur.

*La ligne n'apparaît pas du tout.* C'est le parsing qui bute, pas le catalogue : mise en page inhabituelle, colonne « Antériorités » prise pour la valeur du jour, séparateurs exotiques, ou compte rendu scanné dont l'OCR abîme le libellé. Les pièges déjà rencontrés et la marche à suivre sont détaillés dans [CLAUDE.md](CLAUDE.md).

**Enfin, vérifie :**

```bash
npm run check:catalog                             # aucun alias n'en détourne un autre
npx tsx scripts/test-parsing.mts <le même PDF>    # le marqueur sort avec sa valeur et sa norme
```

`check:catalog` est à lancer après **tout** ajout : il contrôle que chaque alias retrouve bien
son propre marqueur.

Si tu travailles avec Claude Code, les skills `ajouter-marqueur` et `diagnostiquer-parsing`
(dans `.claude/skills/`) déroulent ces deux procédures pas à pas.

## Ce qu'il y a dedans

- `lib/markers/catalog.ts` — ~130 marqueurs : libellés, alias de laboratoire, plages de repli,
  textes du glossaire. Source unique du glossaire et du compte rendu.
- `lib/parsing/` — PDF → marqueurs : couche texte, OCR de repli, plages de référence, unités.
- `lib/analysis/` — bas / normal / haut, recoupements, rédaction du compte rendu.
- `lib/crypto.ts`, `lib/vault.ts`, `lib/session.ts` — le coffre.
- `app/(coffre)/` — les pages qui exigent un coffre déverrouillé.

---

# 🚀 DEMARRER BLOO

```bash
npm install
npm run dev          # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run typecheck` | vérification des types |
| `npm run lint` | eslint |
| `npm run check:catalog` | intégrité du catalogue de marqueurs |
| `npm run check:crypto` | aller-retour de chiffrement du coffre |

---

💻 *Projet codé à 100% en vibe coding avec Claude Code*

