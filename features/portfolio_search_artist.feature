#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "SM 001 n" un des items affichés
  Quand l'utilisateur recherche "larcher" puis choisit "Vincent-Larcher"
  Alors l'item "SM 001 n" est affiché
  Mais l'item "AXN 009" est caché

