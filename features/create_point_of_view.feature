#language: fr

Fonctionnalité: Créer un point de vue

Contexte: Pas de contexte

Scénario: Ajouter le point de vue "Couleur"
  Soit "vitraux" le portfolio ouvert
  Et l'utilisateur "alice" se connecte avec mot de passe "whiterabbit"
  Et on ouvre la page de creation du point de vue
  Quand on ajoute le point de vue "Couleur"
  Alors le point de vue "Couleur" est affiché
