#language: fr

Fonctionnalité: (Dé)sélectionner les items d'un ou de plusieurs corpus


Scénario: L'utilisateur désélectionne un corpus parmi plusieurs

    Soit un portfolio ouvert
    Et tous les corpus sont sélectionnés
    Et "SJ 020" un des items affichés
    Et "PSM 002" un des items affichés
    Quand l'utilisateur désélectionne le corpus "Vitraux - Bénel"
    Alors l'item "PSM 002" est affiché
    Mais l'item "SJ 020" est caché

Scénario: L'utilisateur sélectionne plusieurs corpus

    Soit un portfolio ouvert
    Et aucun des corpus n'est sélectionné
    Et aucun item n'est affiché
    Quand l'utilisateur sélectionne les corpus "Vitraux - Bénel" et "Vitraux - Dr.Krieger"
    Alors l'item "SJ 020" est affiché
    Et l'item "PSM 002" est affiché
