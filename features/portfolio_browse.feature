#language: fr

Fonctionnalité: Feuilleter un portfolio

Scénario: en ajoutant une rubrique à la sélection

Soit "Abram/Abraham" les rubriques sélectionnées
Et "PSM 002" un des items affichés
Et "SJ 001" un des items affichés
Et "SM 001 m" un des items affichés
Et "SM 001 n" un des items affichés
Et "SM 008 g" un des items affichés
Et "SNZ 005" un des items affichés
Et "SNZ 006" un des items affichés
Et "SR 005" un des items affichés
Et "Datation" une des rubriques développées
Quand on sélectionne la rubrique "XIXe s."
Alors l'item "PSM 002" n'est pas affiché
Et l'item "SJ 001" n'est pas affiché
Et l'item "SM 001 m" est affiché
Et l'item "SM 001 n" est affiché
Et l'item "SM 008 g" n'est pas affiché
Et l'item "SNZ 005" n'est pas affiché
Et l'item "SNZ 006" n'est pas affiché
Et l'item "SR 005" est affiché

Scénario: en excluant une rubrique dans la sélection

Soit "Abram/Abraham|XIXe s." les rubriques sélectionnées
Et "PSM 002" un des items cachés
Et "SJ 001" un des items cachés
Et "SM 001 m" un des items affichés
Et "SM 001 n" un des items affichés
Et "SM 008 g" un des items cachés
Et "SNZ 005" un des items cachés
Et "SNZ 006" un des items cachés
Et "SR 005" un des items affichés
Et "Datation" une des rubriques développées 
Quand on sélectionne la rubrique "XIXe s."
Alors l'item "PSM 002" est affiché
Et l'item "SJ 001" est affiché
Et l'item "SM 001 m" n'est pas affiché
Et l'item "SM 001 n" n'est pas affiché
Et l'item "SM 008 g" est affiché
Et l'item "SNZ 005" est affiché
Et l'item "SNZ 006" est affiché
Et l'item "SR 005" n'est pas affiché

Scénario: en remplaçant le ET par un OU dans la sélection

Soit "Abram/Abraham|1518|vers 1520" les rubriques sélectionnées
Et "PSM 002" un des items cachés
Et "SJ 001" un des items cachés
Et "SM 001 m" un des items cachés
Et "SM 001 n" un des items cachés
Et "SM 008 g" un des items cachés
Et "SNZ 005" un des items cachés
Et "SNZ 006" un des items cachés
Et "SR 005" un des items cachés
Quand l'utilisateur sélectionne "Et" entre la rubrique "1518" et la rubrique "vers 1520"
Alors l'item "PSM 002" n'est pas affiché
Et l'item "SJ 001" n'est pas affiché
Et l'item "SM 001 m" n'est pas affiché
Et l'item "SM 001 n" n'est pas affiché
Et l'item "SM 008 g" est affiché
Et l'item "SNZ 005" n'est pas affiché
Et l'item "SNZ 006" est affiché
Et l'item "SR 005" n'est pas affiché
