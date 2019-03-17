#language: fr

Fonctionnalité: Créer un point de vue

Contexte:
  Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"

Scénario: Créer un point de vue "Histoire des sciences"
  Soit "vitraux" le portfolio ouvert
  Quand un visiteur clique sur l'option Nouveau point de vue
  Et tape "Histoire des sciences"
  Et valide
  Alors le point de vue "Histoire des sciences" apparait dans la page d'accueil
