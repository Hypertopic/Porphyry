#language: fr

Fonctionnalité: Enlever un topic de la sélection actuelle

Contexte:
 #Soit "Heinrich" le portfolio spécifié dans la configuration
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"
 Soit le topic "Heinrich" rattaché au point de vue "Histoire de l'art"
 Soit le topic "Personnage" rattaché au point de vue "Histoire des religions"
 Soit il y a 4 images correspondants au topic "Heinrich"
 Soit il y a 3 images correspondants au topic "Heinrich" et "Personnage"
Soit il y a en total 1529 images dans la bdd

Scénario: Enlever le topic qui est le seul choisi

 Soit qu'il y que le topic "Heinrich" choisi
 Quand un visiteur clique sur "Heinrich" dans la liste des topics
 Alors tous les items sont affichés
 Et le nombre des images correspontante change de 4 à 1529

Scénario: Enlever un topic parmi plusieurs topics choisis

 Soit qu'il y le topic "Heinrich" et le topic "Personnage" choisis
 Quand un visiteur clique sur "Personnage" dans la liste des topics
 Alors tous les items concernant le topic "Heinrich" affichés
 Et le nombre des images correspontante change de 3 à 4
