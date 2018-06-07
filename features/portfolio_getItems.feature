#language: fr

Fonctionnalité: A partir d'un item, obtenir ceux qui ont le même thème

Contexte:
  Soit "GRV 005" le portfolio spécifié dans la configuration
  
Scénario: À partir du point de vue "Histoire de l'art" de l'item "GRV 005", obtenir tous les items du même thème
 Quand un visiteur clique le thème "Apocalypse de Jean" dans le point de vue "Histoire des religions"
 Alors le thème affiché est "Apocalypse de Jean"
 Et un des points de vue affichés est "Histoire de l'art"
 Et un des points de vue affichés est "Histoire des religions"
 Et un des corpus affichés est "Vitraux - Bénel"
 Et un des corpus affichés est "Vitraux - Recensement"
