#language: fr

Fonctionnalité: Pour un portfolio donné, créer un point de vue

Contexte:

  Soit le portfolio "vitraux"
  Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
  Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"

Scénario: quand il existe au moins un point de vue

  Soit le portfolio "vitraux" ouvert
  Et l'interface de création du point de vue ouverte
  Et un nom de point de vue "Culture"
  Quand l'utilisateur spécifie et valide le point de vue "Culture"
  Alors le point de vue "Culture" est affiché à l'accueil du portfolio "vitraux"
