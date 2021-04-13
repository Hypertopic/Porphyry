#language: fr

Fonctionnalité: Décrire un item à l’aide d'une rubrique

Scénario: créée à l'occasion
  Soit un item en cours de création
  Et l'utilisateur est connecté
  Quand l'utilisateur indique "Monture en chef d'œuvre" comme nouvelle rubrique du point de vue "Histoire de l'art"
  Alors une des rubriques de l'item est "Monture en chef d'œuvre"

Scénario: créée précédemment
  Soit un item en cours de création
  Et l'utilisateur est connecté
  Quand l'utilisateur indique "pierre" pour la rubrique "Simon / Pierre" du point de vue "Histoire des religions"
  Alors une des rubriques de l'item est "Simon / Pierre"

