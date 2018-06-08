#language: fr

Fonctionnalité: Ajouter un thème à la sélection

Contexte:
 Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le thème "Artiste" rattaché au point de vue "Histoire de l'art"
 Soit "vitraux" le portfolio spécifié dans la configuration

Scénario: Sélectionner un thème
 Quand un visiteur clique sur le thème "4dbf2acc119ff3458a53ae9de59a44a7"
 Alors le sous-titre affiché est "Artiste"
 Et il y a 119 items visibles sur 1529

