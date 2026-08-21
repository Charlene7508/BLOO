# Bloo

Bloo lit un compte rendu d'analyses sanguines, explique en français clair ce que chaque
marqueur mesure, signale ceux qui sortent des normes et propose des recoupements entre eux.

Les explications sont **informatives, jamais un diagnostic** : elles décrivent ce qu'un écart
*peut traduire*, au conditionnel, et renvoient au médecin.

## Tout reste sur ta machine

Aucune donnée de santé ne quitte l'ordinateur. Le PDF est lu localement (couche texte, ou OCR
si le compte rendu est scanné), le compte rendu est rédigé localement, et tout est rangé dans
un coffre chiffré : scrypt + AES-256-GCM, la clé n'existe qu'en mémoire, le temps de la
session. Le modèle de langue de l'OCR est embarqué dans `vendor/` pour qu'aucun téléchargement
ne soit nécessaire. Le dossier `data/` (base chiffrée et pièces jointes) n'est jamais versionné.

## Démarrer

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

Pour éprouver le parsing sur un vrai compte rendu (jamais versionné) :

```bash
npx tsx scripts/test-parsing.mts <fichier.pdf>   # marqueurs extraits, ligne par ligne
npx tsx scripts/check-report.mts <fichier.pdf>   # chaîne complète jusqu'au compte rendu
```

## Ce qu'il y a dedans

- `lib/markers/catalog.ts` — ~130 marqueurs : libellés, alias de laboratoire, plages de repli,
  textes du glossaire. Source unique du glossaire et du compte rendu.
- `lib/parsing/` — PDF → marqueurs : couche texte, OCR de repli, plages de référence, unités.
- `lib/analysis/` — bas / normal / haut, recoupements, rédaction du compte rendu.
- `lib/crypto.ts`, `lib/vault.ts`, `lib/session.ts` — le coffre.
- `app/(coffre)/` — les pages qui exigent un coffre déverrouillé.

Next.js 15, React 19, Tailwind v4, SQLite (better-sqlite3).

Les conventions de contribution et les pièges déjà rencontrés sur le parsing sont détaillés
dans [CLAUDE.md](CLAUDE.md).
