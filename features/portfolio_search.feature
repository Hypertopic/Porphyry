#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

  Soit "vitraux" le portfolio ouvert
  Et "AXN 009" un des items affichés
  Et "SJ 001" un des items affichés
  Quand l'utilisateur recherche "auxon" puis choisit "spatial : Église Saint-Loup, Auxon"
  Alors l'item "AXN 009" est affiché
  Mais l'item "SJ 001" est caché
  
Scénario : un nom d'attribut

  Soit "vitraux" le portfolie ouvert
  Et "AXN 009" un des items affichés
  Et "PSM 002" un des items affichés
  Quand l'utilisateur recherche "creator" puis choisit sur "Dr.Krieger"
  Alors l'item "AXN 009" est caché
  Mais l'item "PSM 002" est affiché

