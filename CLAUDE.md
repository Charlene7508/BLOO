# Bloo — décodeur d'analyses sanguines

Bloo lit un compte rendu de laboratoire, explique en français clair ce que chaque marqueur
mesure, signale ceux qui sortent des normes et propose des recoupements entre eux. Les
explications sont **informatives, jamais un diagnostic**.

## Deux règles non négociables

1. **Aucune donnée de santé ne quitte la machine.** Pas d'appel réseau avec un résultat, un
   nom, un PDF ou un extrait de compte rendu. Le parsing, l'OCR et la rédaction du compte rendu
   sont tous locaux. Si une évolution exige un service externe, elle doit être explicitement
   choisie par l'utilisateur, désactivée par défaut, et ne transmettre que des données minimisées.
2. **Bloo ne pose jamais de diagnostic.** Les textes décrivent ce qu'un écart *peut traduire*,
   au conditionnel, et renvoient au médecin. Ne jamais écrire « vous avez », « il s'agit de »,
   ni recommander un traitement ou une posologie.

## Démarrer

```bash
npm run dev          # développement, http://localhost:3000
npm run build        # build de production
npm run typecheck    # vérification des types
npm run lint         # eslint
```

Node est installé dans `~/.local/node` (le PATH est ajouté par `~/.bashrc`).

Bancs d'essai, à lancer sur de vrais comptes rendus (jamais versionnés) :

```bash
npx tsx scripts/test-parsing.mts <fichier.pdf>   # marqueurs extraits, ligne par ligne
npx tsx scripts/check-report.mts <fichier.pdf>   # chaîne complète jusqu'au compte rendu
npm run check:crypto                             # aller-retour de chiffrement
npm run check:catalog                            # intégrité du catalogue (à lancer après tout ajout)
```

## Architecture

| Chemin | Rôle |
|---|---|
| `lib/markers/catalog.ts` | Les ~130 marqueurs : libellés, alias de laboratoire, plages de repli, textes du glossaire. **Source unique** du glossaire et du compte rendu. |
| `lib/parsing/` | PDF → marqueurs. `pdf.ts` (couche texte), `ocr.ts` (scans), `extract.ts` (orchestration), `matchMarker.ts`, `refrange.ts`, `units.ts`. |
| `lib/analysis/` | `status.ts` (bas/normal/haut), `patterns.ts` (recoupements), `report.ts` (compte rendu). |
| `lib/crypto.ts`, `lib/vault.ts`, `lib/session.ts` | Coffre : scrypt + AES-256-GCM, clé en mémoire seulement. |
| `lib/analyses.ts`, `lib/profile.ts` | Lecture/écriture chiffrées en SQLite. |
| `app/(coffre)/` | Pages exigeant un coffre déverrouillé. |
| `vendor/tessdata/` | Modèle de langue française de Tesseract, embarqué pour éviter tout téléchargement. |

## Ce qu'il faut savoir avant de toucher au parsing

Le parseur a été calé sur deux formats de laboratoire réels et très différents. Les pièges
rencontrés, tous encore actifs :

- **La colonne « Antériorités »** contient d'anciens résultats. La confondre avec la valeur du
  jour est l'erreur la plus coûteuse. Les colonnes sont repérées par la position de leurs
  en-têtes (`findColumns`), pas par l'ordre du texte.
- **Un alias trop court ou trop générique détourne silencieusement un autre marqueur** — « TG »
  capté par les triglycérides plutôt que par la thyroglobuline, par exemple. `check-catalog.mts`
  vérifie que chaque alias retrouve bien son propre marqueur : le lancer après tout ajout.
- **La plage de référence imprimée par le laboratoire prime toujours** sur celle du catalogue :
  les normes dépendent de la technique d'analyse. Elle est aussi ce qui permet de situer un
  marqueur **absent du catalogue** : savoir si une valeur est dans l'intervalle ne demande
  aucune connaissance du marqueur, seule l'explication en a besoin.
- **Une mesure n'est jamais écartée en silence.** Une ligne qui porte une norme imprimée est
  conservée même sans marqueur reconnu (`markerKey: null`) et affichée à part dans le compte
  rendu. Sans cela l'utilisateur croirait son analyse entièrement décodée alors qu'elle ne le
  serait qu'en partie. Le filtre `looksLikeResult` écarte en-têtes, notes et lignes de
  technique d'analyse.
- Les séparateurs varient : signe moins U+2212, `à` au lieu d'un tiret, milliers séparés par des
  espaces (`4 170 000`), virgule décimale, `µ` micro contre `μ` grec.
- `G/L` (giga par litre) et `g/L` (grammes par litre) ne diffèrent que par la casse et n'ont
  aucun rapport : ne jamais normaliser une unité en minuscules.
- pdfjs **s'approprie et détache** le tableau d'octets qu'on lui passe : toujours lui donner une
  copie si les octets doivent être relus (le repli OCR en dépend).
- L'OCR lit correctement les valeurs mais **abîme souvent les unités** (`g/dL` → `gyaL`). D'où
  le repli sur l'unité du catalogue, et l'écran de vérification obligatoire.

## Conventions

- Interface et code en français : libellés, commentaires, messages d'erreur. Tutoiement de
  l'utilisateur, ton chaleureux, phrases courtes.
- Tailwind v4, jetons de couleur définis dans `app/globals.css` (`blush`, `cream`, `ink`,
  `ok`/`watch`/`alert`). Classes utilitaires : `bloo-card`, `bloo-btn`, `bloo-input`.
- Bloo, la mascotte, est une illustration **statique** (`components/Bloo.tsx`), déclinée seulement
  en taille. Le personnage porte le même nom que l'application : ne jamais l'appeler « Bloody ».
- Les pages sous `app/(coffre)/` sont en `force-dynamic` : elles dépendent de la session et du
  contenu chiffré, rien ne peut y être pré-généré.

## Pièges déjà rencontrés

- Pré-générer une page du groupe `(coffre)` au build ouvre la base depuis plusieurs workers et
  provoque `SQLITE_BUSY`. Ne pas ajouter de `generateStaticParams` sous ce groupe.
- Les modules natifs ou WebAssembly (`better-sqlite3`, `@napi-rs/canvas`, `tesseract.js`,
  `pdfjs-dist`) doivent rester dans `serverExternalPackages` de `next.config.ts`.
- Les scripts de `scripts/` utilisent le `await` de haut niveau : ils portent l'extension
  `.mts`, sinon tsx les compile en CommonJS et échoue.
- Quand un marqueur n'a de plage de référence que pour un sexe (cas des hormones, dont les valeurs
  féminines dépendent du cycle), `findCatalogRange` ne renvoie **rien** plutôt que la plage de
  l'autre sexe : appliquer une norme masculine à une femme fabriquerait une alerte de toutes pièces.
