#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur de rubrique

  Soit "vitraux" le portfolio ouvert
  Et "SM 001 n" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "larcher" puis choisit "Artiste > Vincent-Larcher"
  Alors l'item "SM 001 n" est affiché
  Mais l'item "SJ 001" est caché
