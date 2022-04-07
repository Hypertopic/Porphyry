#language: fr

Fonctionnalité: Consulter les attributs lors d'une recherche

Scénario: d'une valeur d’attribut

    Soit "Dessins" le portfolio ouvert
    Et "1996_14-17_13_RUS_R_C" un des items affichés
    Et "1994_6-9_11_ROM_R_C" un des items affichés
    Quand on sélectionne la valeur d’attribut "Roumanie" en tant que "spatial"
    Alors l’item "1996_14-17_13_RUS_R_C" est caché
    Et l’item "1994_6-9_11_ROM_R_C" est affiché
