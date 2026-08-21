---
name: ajouter-marqueur
description: Ajouter un marqueur sanguin au catalogue de Bloo (glossaire + reconnaissance dans les PDF + normes). À utiliser quand un compte rendu contient un marqueur que Bloo ne reconnaît pas, ou pour enrichir le glossaire.
---

# Ajouter un marqueur au catalogue

Le catalogue `lib/markers/catalog.ts` est la source unique : une seule entrée alimente à la fois
la reconnaissance dans les PDF, les normes de repli, le glossaire et les textes du compte rendu.

## Procédure

1. **Vérifier qu'il n'existe pas déjà**, y compris sous un autre nom :
   ```bash
   grep -in "<nom ou abréviation>" lib/markers/catalog.ts
   ```

2. **Ajouter l'entrée** dans la section de sa catégorie, en respectant l'ordre du fichier :

   ```ts
   {
     key: "identifiant_stable",        // jamais modifié ensuite : il est stocké dans les analyses
     label: "Nom affiché",
     aliases: [...],                    // voir ci-dessous
     category: "hematologie",           // cf. MarkerCategory
     unit: "µmol/L",                    // unité proposée en saisie manuelle
     ranges: [{ unit: "µmol/L", low: 10, high: 30 }],
     about: "…",                        // à quoi sert ce marqueur
     high: "…",                         // ce qu'une valeur haute peut traduire
     low: "…",                          // ce qu'une valeur basse peut traduire
   }
   ```

3. **Soigner les alias** — c'est ce qui détermine la reconnaissance :
   - écrire les variantes réellement imprimées par les laboratoires (`gamma gt`, `ggt`, `y-gt`) ;
   - les accents et la ponctuation sont normalisés, inutile de les décliner (`V.G.M.` → `vgm`
     est géré automatiquement) ;
   - les alias de **1 ou 2 caractères** ne matchent que sur un libellé strictement identique,
     pour éviter les faux positifs ;
   - l'alias le plus long gagne : ajouter `fer serique` ne casse pas `fer`.

4. **Renseigner les plages** avec discernement :
   - une plage par sexe quand la norme en dépend (`sex: "F"` / `sex: "M"`) ;
   - une plage par unité usuelle, avec les valeurs correspondantes — Bloo ne convertit pas ;
   - valeurs adultes uniquement ;
   - ces plages ne servent que de **repli** : l'intervalle imprimé par le laboratoire prime.

5. **Écrire les textes** selon les règles de `CLAUDE.md` : informatif, au conditionnel, jamais de
   diagnostic ni de posologie. Deux à quatre phrases, ton chaleureux, tutoiement absent des
   textes du glossaire (ils sont impersonnels), causes les plus fréquentes en premier.

6. **Vérifier** :
   ```bash
   npx tsc --noEmit -p tsconfig.json
   npx tsx scripts/test-parsing.mts <un vrai compte rendu contenant ce marqueur>
   ```
   Le marqueur doit apparaître avec la bonne valeur, la bonne unité et sa plage.

## Si le marqueur devrait se recouper avec d'autres

Ajouter une règle dans `lib/analysis/patterns.ts` plutôt que d'alourdir le texte `high`/`low` :
c'est la combinaison de plusieurs marqueurs qui porte l'information, et une règle s'affiche dans
la section « Ce que ces résultats peuvent traduire ensemble ».
