#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "SAA B" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "acad" puis choisit "spatial : Société académique de l'Aube"
  Alors l'item "SAA B" est affiché
  Mais l'item "SJ 001" est caché

Scénario: un type d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "PSM 002" un des items affichés
  Quand l'utilisateur recherche "creator" puis choisit "creator : Denis Krieger"
  Alors l'item "PSM 002" est affiché
  Mais l'item "AXN 009" est caché

Scénario: une rubrique

  Soit "vitraux" le portfolio ouvert
  Et "SM 001 n" un des items affichés
  Et "SM 008 g" un des items affichés
  Quand l'utilisateur recherche "larcher" puis choisit "Artiste > Vincent-Larcher"
  Alors l'item "SM 001 n" est affiché
  Mais l'item "SM 008 g" est caché

Scénario: plusieurs attributs

  Soit "vitraux" le portfolio ouvert
  Et l'item "SJ 000" est affiché
  Et l'item "SJ 002" est affiché
  Et l'item "RLV 106" est caché
  Quand l'utilisateur recherche "Saint-Jean-au-Marché" puis choisit "spatial : Église Saint-Jean-au-Marché, Troyes"
  Et l'utilisateur recherche "vincent" puis choisit "Artiste > Vincent-Larcher"
  Alors la recherche est "spatial : Église Saint-Jean-au-Marché, Troyes" et "Vincent-Larcher"
  Et l'item "SJ" est caché
  Et l'item "SJ 000" est caché
  Et l'item "SJ 001" est caché
  Et l'item "SJ 002" est caché
  Et l'item "SJ 020" est caché
  Et l'item "SJ 100" est caché
  Et l'item "SJ 102" est caché
