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