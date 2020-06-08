#language: fr

Fonctionnalité: Voir les vignettes d'items du même nom

Scénario:

Soit "AXN 009" l'item affiché
Et l'attribut "created" a pour valeur "2017-09-24"
Et "AXN 009" un des items affichés
Quand l'utilisateur choisit l'item "AXN 009" dans le bloc Items ayant le même nom
Alors l'item "AXN 009" est affiché
Et la valeur de l'attribut "created" est "1907/1914"
Et l'item "AXN 009" est affiché
