---
name: diagnostiquer-parsing
description: Diagnostiquer pourquoi Bloo lit mal un compte rendu de laboratoire — marqueur manquant, valeur fausse, norme absente. À utiliser dès qu'un PDF donne un résultat inattendu.
---

# Diagnostiquer une extraction ratée

Toujours travailler sur un **vrai** compte rendu, jamais sur un exemple inventé : les formats de
laboratoire sont trop divers pour être devinés. Ne jamais copier ces fichiers dans le dépôt —
ce sont des données de santé. Les garder dans un répertoire temporaire.

## 1. Voir ce que Bloo extrait

```bash
npx tsx scripts/test-parsing.mts /chemin/vers/compte-rendu.pdf
```

La première ligne indique `source=texte` ou `source=ocr`. Un `source=ocr` sur un PDF récent
signale que la couche texte est absente ou vide.

## 2. Voir la mise en page réelle

Le plus instructif est de regarder les positions. Petit script jetable :

```js
// dump.mjs — à supprimer après usage
import fs from "node:fs";
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(process.argv[2])) }).promise;
const page = await doc.getPage(1);
for (const it of (await page.getTextContent()).items) {
  if (it.str?.trim()) console.log(`y=${it.transform[5].toFixed(1)} x=${it.transform[4].toFixed(1)} | ${JSON.stringify(it.str)}`);
}
```

Regarder en priorité l'abscisse des en-têtes « Valeurs de référence » et « Antériorités » : c'est
sur eux que `findColumns` découpe les colonnes.

## 3. Causes fréquentes, par symptôme

| Symptôme | Cause habituelle |
|---|---|
| Valeur = ancien résultat | Colonne « Antériorités » mal située : l'en-tête n'a pas été reconnu par `findColumns`. |
| Valeur absurde, chiffres collés | Deux colonnes fusionnées : la plage de référence a été avalée par le motif de nombre. |
| Marqueur absent | Alias manquant dans le catalogue, ou libellé noyé dans des points de conduite. |
| Norme absente | Format d'intervalle non couvert par `refrange.ts` (`Inf. à 600`, `5 à 34`, `< 1,60`…). |
| Unité fausse après OCR | Normal : l'OCR abîme les unités. Le repli sur l'unité du catalogue s'en charge. |
| Nombre pris dans un mot | `isStandaloneNumber` doit rejeter : vérifier que le contrôle porte bien sur `match[1]`, pas `match[0]`. |

## 4. Corriger au bon endroit

- Un libellé non reconnu → **alias** dans `lib/markers/catalog.ts`.
- Un format d'intervalle → `lib/parsing/refrange.ts`.
- Une unité inconnue → `lib/parsing/units.ts` (attention à la casse : `G/L` ≠ `g/L`).
- Un découpage de colonnes → `findColumns` dans `lib/parsing/extract.ts`.

## 5. Contrôler la non-régression

Le parseur est calé sur deux formats réels. Après toute modification, relancer les deux :

```bash
npx tsx scripts/test-parsing.mts <pdf-texte> | head -5
npx tsx scripts/test-parsing.mts <pdf-scanné> | head -5
```

Un gain sur un format qui dégrade l'autre n'est pas un gain. Une extraction parfaite n'est de
toute façon pas l'objectif : l'écran de vérification est obligatoire et c'est lui qui garantit
la justesse finale.
