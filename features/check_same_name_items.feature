#language: fr

Fonctionnalité: Voir les vignettes d'items du même nom

Scénario:

Soit "KER 2733" l'item affiché
Et l'attribut "view" a pour valeur "face"
Et "KER 2733" un des items affichés
Quand l'utilisateur choisit l'item "KER 2733" dans le bloc Items ayant le même nom
Alors l'item "KER 2733" est affiché
Et la valeur de l'attribut "view" est "côté"
