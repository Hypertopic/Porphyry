#language: fr

Fonctionnalité: Combiner les critères de sélection

Scénario: en ajoutant une rubrique

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
  Alors l'item "SM 001 m" est affiché
  Et l'item "SM 001 n" est affiché
  Et l'item "SR 005" est affiché
  Mais l'item "PSM 002" est caché
  Et l'item "SJ 001" est caché
  Et l'item "SM 008 g" est caché
  Et l'item "SNZ 005" est caché
  Et l'item "SNZ 006" est caché

Scénario: en excluant une rubrique

  Soit "Abram/Abraham|XIXe s." les rubriques sélectionnées
  Et "SM 001 m" un des items affichés
  Et "SM 001 n" un des items affichés
  Et "SR 005" un des items affichés
  Et "PSM 002" un des items cachés
  Et "SJ 001" un des items cachés
  Et "SM 008 g" un des items cachés
  Et "SNZ 005" un des items cachés
  Et "SNZ 006" un des items cachés
  Et "Datation" une des rubriques développées
  Quand on sélectionne la rubrique "XIXe s."
  Alors l'item "PSM 002" est affiché
  Et l'item "SJ 001" est affiché
  Et l'item "SM 008 g" est affiché
  Et l'item "SNZ 005" est affiché
  Et l'item "SNZ 006" est affiché
  Mais l'item "SM 001 m" est caché
  Et l'item "SM 001 n" est caché
  Et l'item "SR 005" est caché

Scénario: en remplaçant le ET par un OU

  Soit "Abram/Abraham|1518|vers 1520" les rubriques sélectionnées
  Et "PSM 002" un des items cachés
  Et "SJ 001" un des items cachés
  Et "SM 001 m" un des items cachés
  Et "SM 001 n" un des items cachés
  Et "SM 008 g" un des items cachés
  Et "SNZ 005" un des items cachés
  Et "SNZ 006" un des items cachés
  Et "SR 005" un des items cachés
  Quand l'utilisateur change l'opérateur entre la rubrique "1518" et la rubrique "vers 1520"
  Alors l'item "SM 008 g" est affiché
  Et l'item "SNZ 006" est affiché
  Mais l'item "PSM 002" est caché
  Et l'item "SJ 001" est caché
  Et l'item "SM 001 m" est caché
  Et l'item "SM 001 n" est caché
  Et l'item "SNZ 005" est caché
  Et l'item "SR 005" est caché


Scénario: select negative element
 Soit "Artiste" et "Datation" les rubriques sélectionnées négativement
 Et "AXN 009" un des items affichés
 Et "AXN 009" un des items affichés
 Et "PSM 002" un des items affichés
 Et "SJ 001" un des items affichés
 Et "SM001 m" un des items cachés
 Et "SM 008g" un des items cachés
 Et "SNZ 005" un des items affichés
 Et "SNZ 006" un des items cachés
 Et "SNZ 009" un des items affichés
 Et "SR 005" un des items cachés
 Quand l'utilisateur change l'opérateur entre la rubrique "Artiste" et la rubrique "Datation"
 Alors l'item "AXN 009" est affiché
 Et "AXN 009" un des items affichés
 Et "PSM 002" un des items affichés
 Et "SJ 001" un des items affichés
 Et "SM001 m" un des items affichés
 Et "SM 008g" un des items affichés
 Et "SNZ 005" un des items affichés
 Et "SNZ 006" un des items affichés
 Et "SNZ 009" un des items affichés
 Et "SR 005" un des items affichés
