#language: fr

Fonctionnalité: Consulter les attributs lors d'une recherche

Scénario: d'une valeur d’attribut

    Soit "vitraux" le portfolio ouvert
    Et "AXN 009" un des items affichés
    Et "PSM 002" un des items affichés
    Quand on sélectionne la valeur d'attribut "Aurélien Bénel" en tant que "creator"
    Alors l'item "PSM 002" est caché
    Et l'item "AXN 009" est affiché
