#language: fr

Fonctionnalité: Créer un nouveau point de vue

Contexte:
  Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
  Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"

Scénario:

  Soit "vitraux" le portfolio spécifié dans la configuration
  Soit "vitraux" le portfolio ouvert
  Soit l'utilisateur est connecté
  Soit l'utilisateur est sur la page de création de nouveau point de vue

  Quand un utilisateur crée un nouveau point de vu nommé "Mon nouveau point de vue"

  Alors le point de vue "Mon nouveau point de vue" est ajouté au portfolio "vitraux"
