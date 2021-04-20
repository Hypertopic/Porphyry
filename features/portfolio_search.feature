#language: fr

Fonctionnalité: Sélectionner des items en cherchant

  Scénario: une valeur d'attribut

    Soit "vitraux" le portfolio ouvert
    Et "AXN 009" un des items affichés
    Et "SJ 001" un des items affichés
    Quand l'utilisateur recherche "auxon" puis choisit "spatial : Église Saint-Loup, Auxon"
    Alors l'item "AXN 009" est affiché
    Mais l'item "SJ 001" est caché

  Scénario: search for a creator

    Soit "vitraux" le portfolio ouvert
    Et "AXN 009" un des items affichés
    Et "PSM 002" un des items affichés
    Quand l'utilisateur recherche "creator" puis choisit "creator : Denis Krieger"
    Alors l'item "PSM 002" est affiché
    Mais l'item "AXN 009" est caché

  Scénario: une valeur d'attribut

    Soit "vitraux" le portfolio ouvert
    Et "SM 001 n" un des items affichés
    Et "SJ 001" un des items affichés
    Quand l'utilisateur recherche "larcher" puis choisit "Artiste > Vincent-Larcher"
    Alors l'item "SM 001 n" est affiché
    Mais l'item "SJ 001" est caché

  Scénario: en sélectionnant négativement des rubriques

    Soit "Artiste|Datation" les rubriques sélectionnées négativement
    Et "AXN 009" un des items affichés
    Et "PSM 002" un des items affichés
    Et "SJ 001" un des items affichés
    Et "SNZ 005" un des items affichés
    Et "SNZ 009" un des items affichés
    Et "SM 001 m" un des items cachés
    Et "SM 008 g" un des items cachés
    Et "SNZ 006" un des items cachés
    Et "SR 005" un des items cachés
    Quand l'utilisateur change l'opérateur entre la rubrique "Artiste" et la rubrique "Datation"
    Alors l'item "SM 008 g" est affiché
    Et "AXN 009" un des items affichés
    Et "AXN 009" un des items affichés
    Et "PSM 002" un des items affichés
    Et "SJ 001" un des items affichés
    Et "SM001 m" un des items affichés
    Et "SM 008 g" un des items affichés
    Et "SNZ 005" un des items affichés
    Et "SNZ 006" un des items affichés
    Et "SNZ 009" un des items affichés
    Et "SR 005" un des items affichés