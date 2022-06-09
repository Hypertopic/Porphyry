#language: fr

Fonctionnalité: Rechercher des items à partir d'une plage de valeurs d'un attribut

Scénario: numérique

    Soit "vitraux" le portfolio ouvert
    Et "slider" le paramètre appliqué à l'attribut "created"
    Et "SNZ 009" un des items affichés
    Et "SR 005" un des items affichés
    Et "SJ 000" un des items affichés
    Et "AXN 009" un des items affichés
    Quand l'utilisateur sélectionne un intervalle entre "2015" et "2016" pour l'attribut "created"
    Alors l'item "SR 005" est affiché
    Et l'item "SJ 000" est affiché
    Mais l'item "SNZ 009" est caché
    Et l'item "AXN 009" est caché

