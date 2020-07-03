#language: fr

Fonctionnalité: Sélectionner des items en fonction d'un attribut donné

Scénario: Recherche par attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "auxon" puis choisit "spatial : Église Saint-Loup, Auxon"
  Alors l'item "AXN 009" est affiché
  Et l'item "SJ 001" n'est pas affiché
