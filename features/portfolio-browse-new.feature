#language: fr

Fonctionnalité: Combiner les critères de sélection des items

Scénario: en ajoutant une rubrique par sélection

    Soit "Abram/Abraham" les rubriques sélectionnées
    Et "SJ 001" un des items affichés
    Et "SM 001 n" un des items affichés
    Et "SM 008 g" un des items affichés
    Et "SNZ 006" un des items affichés
    Et "SR 005" un des items affichés
    Et "Artiste" une des rubriques développées
    Quand on sélectionne la rubrique "Vincent-Larcher"
    Alors l'item "SM 001 n" est affiché
    Mais l'item "SJ 001" est caché
    Et l'item "SM 008 g" est caché
    Et l'item "SNZ 006" est caché
    Et l'item "SR 005" est caché

Scénario: en ajoutant une rubrique par recherche

    Soit "Abram/Abraham" les rubriques sélectionnées
    Et "PSM 002" un des items affichés
    Et "SJ 001" un des items affichés
    Et "SM 001 m" un des items affichés
    Et "SM 001 n" un des items affichés
    Et "SM 008 g" un des items affichés
    Et "SNZ 005" un des items affichés
    Et "SNZ 006" un des items affichés
    Et "SR 005" un des items affichés
    Et "AXN 009" un des items cachés
    Quand l'utilisateur recherche "Datation" puis choisit "Datation"
    Alors l'item "SM 001 m" est affiché
    Et l'item "SM 001 n" est affiché
    Et l'item "SM 008 g" est affiché
    Et l'item "SNZ 006" est affiché
    Et l'item "SR 005" est affiché
    Mais l'item "PSM 002" est caché
    Et l'item "SJ 001" est caché
    Et l'item "SNZ 005" est caché
    Et l'item "AXN 009" est caché
