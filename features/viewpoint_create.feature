#language: fr

Fonctionnalité: Créer point de vue

Contexte: Soit le nouveau point de vue n'est pas contenu dans le portfolio

Scénario:
  Soit "vitraux" le portfolio ouvert
  Quand un visiteur ajoute un nouveau point de vue "Formations de l'UTT"
  Alors un des points de vue affichés est "Formations de l'UTT" au portfolio "vitraux"
