#language: fr

Fonctionnalité: chercher une rubrique

Scénario: un item contenu dans la rubrique

  Soit "vitraux" le portfolio ouvert
  Et "SM 001 n" un des items affichés
  Et "AXN 009" un des items affichés
  Quand l'utilisateur recherche "larcher" puis choisit "Artiste > Vincent-Larcher"
  Alors l'item "SM 001 n" est affiché
  Mais l'item "AXN 009" est caché
