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

