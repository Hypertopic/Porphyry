#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "auxon" puis choisit "spatial : Église Saint-Loup, Auxon"
  Alors l'item "AXN 009" est affiché
  Mais l'item "SJ 001" est caché

Scénario: rechercher un attribut et sélectionner une valeur

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "PSM 002" un des items affichés
  Et "SJ 001" un des items affichés
  Et "SM 001 m" un des items affichés
  Et "SM 001 n" un des items affichés 
  Et "SM 008 g" un des items affichés
  Et "SMV 129" un des items affichés
  Et "SNZ 005" un des items affichés
  Et "SNZ 006" un des items affichés
  Et "SNZ 009" un des items affichés
  Et "SR 005" un des items affichés
  Quand l'utilisateur recherche "creator" puis choisit "Denis Krieger"
  Alors l'item "PSM 002" est affiché
  Mais l'item "AXN 009" est caché 
  Mais l'item "SJ 001" est caché 
  Mais l'item "SM 001 m" est caché
  Mais l'item "SM 001 n" est caché
  Mais l'item "SM 008 g" est caché
  Mais l'item "SMV 129" est caché 
  Mais l'item "SNZ 005" est caché 
  Mais l'item "SNZ 006" est caché 
  Mais l'item "SNZ 009" est caché 
  Mais l'item "SR 005" est caché 
