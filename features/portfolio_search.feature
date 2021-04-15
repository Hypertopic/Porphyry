#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "auxon" puis choisit "spatial : Église Saint-Loup, Auxon"
  Alors l'item "AXN 009" est affiché
  Mais l'item "SJ 001" est caché

Scénario: valeur d'attribut Denis Krieger

  Soit "vitraux" le portfolio ouvert
  Et "PSM 002" un des items affichés
  Et "SR 005" un des items affichés
  Quand l'utilisateur recherche "creator" puis choisit "creator : Denis Krieger"
  Alors l'item "PSM 002" est affiché
  Mais l'item "SR 005" est caché

Scénario: valeur d'attribut Artiste

  Soit "vitraux" le portfolio ouvert
  Et "SM 001 n" un des items affichés
  Et "SR 005" un des items affichés
  Quand l'utilisateur recherche "larcher" puis choisit "Artiste > Vincent-Larcher"
  Alors l'item "SM 001 n" est affiché
  Mais l'item "SR 005" est caché
