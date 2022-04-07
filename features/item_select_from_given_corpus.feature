#language: fr

Fonctionnalité: (Dé)sélectionner les items d'un ou de plusieurs corpus


Scénario: L'utilisateur désélectionne un corpus parmi plusieurs

    Soit "Glyptique" le portfolio ouvert
    Et tous les corpus sont sélectionnés
    Et "AGDS Munich n° 2589.png" un des items affichés
    Et "Boston Fine Arts inv. 23.583.jpg" un des items affichés
    Quand l'utilisateur désélectionne le corpus "Gemmae Campaniae"
    Alors l'item "Boston Fine Arts inv. 23.583.jpg" est affiché
    Mais l'item "AGDS Munich n° 2589.png" est caché     

Scénario: L'utilisateur sélectionne plusieurs corpus

    Soit "Glyptique" le portfolio ouvert
    Et aucun des corpus n'est sélectionnés
    Et aucun item n'est affiché
    Quand l'utilisateur sélectionne les corpus "Gemmae Campaniae" et "Pictures within Pictures"
    Alors l'item "Boston Fine Arts inv. 23.583.jpg" est affiché
    Et l'item "AGDS Munich n° 2589.png" est affiché