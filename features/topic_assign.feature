#language: fr

Fonctionnalité: Décrire un item à l’aide d’une rubrique existante

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l‘utilisateur indique "Monture en chef d'œuvre" comme valeur de la rubrique du point de vue "Histoire de l'art"
  Alors une des rubriques de l'item est "Monture en chef d'œuvre"
