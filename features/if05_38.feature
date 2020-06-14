#language: fr

Fonctionnalité: Sort items according to the values of a given attribute

Scénario:
Soit "vitraux" le portfolio ouvert
Et "SM 001 m" un des items affichés
Et "SM 001 n" un des items affichés
Et "SR 005" un des items affichés
Et "Datation" une des rubriques développées
Et on sélectionne la rubrique "XIXe s."
Quand on sélectionne le sélecteur "Semestre"
Alors je vois en ordre la liste
|Items|
|SM 001 m|
|SM 001 n|
|SR 005|
