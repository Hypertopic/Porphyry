#language: fr

Fonctionnalité: Rechercher "larcher" -> "Artiste > Vincent Larcher"

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "PSM 002" un des items affichés
  Et "SM 001 n" un des items affichés
  Quand l'utilisateur recherche "larcher" puis choisit "Artiste > Vincent-Larcher"
  Alors l'item "SM 001 n" est affiché
  Mais l'item "PSM 002" est caché 
