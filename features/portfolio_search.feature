#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "SNZ 009" un des items affichés
  Et "PSM 002" un des items affichés
  Quand l'utilisateur recherche "creator" puis choisit "creator : Denis Krieger"
  Alors l'item "PSM 002" est affiché
  Mais l'item "SNZ 009" est caché

