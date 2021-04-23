#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "auxon" puis choisit "spatial : Église Saint-Loup, Auxon"
  Alors l'item "AXN 009" est affiché
  Mais l'item "SJ 001" est caché

Scénario: un type d'attribut 

  Soit "vitraux" le portfolio ouvert
  Quand l'utilisateur recherche "creator" puis choisit "creator : Denis Krieger"
  Alors l'item "PSM 002" est affiché
  Mais l'item "AXN 009" est caché
  Et l'item "SJ 001" est caché
  Et l'item "SM 001 m" est caché
  Et l'item "SM 001 n" est caché
  Et l'item "SM 008 g" est caché
  Et l'item "SNZ 005" est caché
  Et l'item "SNZ 006" est caché
  Et l'item "SNZ 009" est caché
  Et l'item "SR 005" est caché
