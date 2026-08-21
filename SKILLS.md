# Compétences et agents du projet Bloo

Ce fichier recense les automatisations mises à disposition de Claude Code sur ce projet.
Les fichiers réels vivent dans `.claude/` ; ce document sert d'index et explique quand
recourir à quoi.

## Skills — `.claude/skills/`

Une skill est une procédure que Claude charge au moment où elle devient pertinente.

| Skill | Quand elle sert |
|---|---|
| **`ajouter-marqueur`** | Un compte rendu contient un marqueur que Bloo ne reconnaît pas, ou le glossaire doit s'enrichir. Couvre l'entrée de catalogue, le choix des alias, les plages par sexe et par unité, et la rédaction des textes. |
| **`diagnostiquer-parsing`** | Un PDF est mal lu : marqueur manquant, valeur fausse, norme absente. Contient la procédure de diagnostic, le script de dump des positions et un tableau symptôme → cause. |

Invocation : `/ajouter-marqueur`, `/diagnostiquer-parsing`, ou simplement en décrivant le besoin.

## Sub-agents — `.claude/agents/`

Un sub-agent travaille dans son propre contexte, avec des consignes et des outils restreints.

| Agent | Rôle | Outils |
|---|---|---|
| **`redacteur-medical`** | Rédige et relit tout contenu de santé vu par l'utilisateur : glossaire, règles de recoupement, messages d'interface. Garant du ton et de l'absence de propos diagnostique. | lecture / écriture, pas de shell |
| **`parseur-labo`** | Adapte le parseur à un nouveau format de laboratoire, avec obligation de non-régression sur les deux formats de référence. | lecture / écriture + shell |
| **`gardien-confidentialite`** | Vérifie qu'aucune donnée de santé ne sort de la machine ni ne se retrouve en clair sur le disque. À lancer avant chaque livraison. | lecture seule + shell |

Exemples d'appel :

```
Utilise le sub-agent redacteur-medical pour relire les textes des marqueurs de la thyroïde.
Utilise le sub-agent parseur-labo : ce compte rendu Cerballiance sort des valeurs fausses.
Utilise le sub-agent gardien-confidentialite avant que je publie.
```

## Pourquoi ceux-là

Les trois risques propres à Bloo ne sont pas des risques de code ordinaires :

1. **Écrire quelque chose qui ressemble à un avis médical** — d'où `redacteur-medical`, dont la
   consigne principale est une limite, pas une tâche.
2. **Attribuer silencieusement une valeur fausse à un marqueur** — une erreur de parsing ne
   plante pas, elle ment. D'où `parseur-labo` et sa règle de non-régression.
3. **Laisser fuir des données de santé** — d'où `gardien-confidentialite`, en lecture seule,
   qui contrôle réseau, journaux, disque et clés.
