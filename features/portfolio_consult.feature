#language: fr

Fonctionnalité: Consulter un portfolio

Contexte:
Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"
Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
Soit le corpus "Vitraux - Recensement" rattaché au portfolio "vitraux"

Scénario: Consulter le portfolio spécifié dans la configuration

Soit "vitraux" le portfolio spécifié dans la configuration
Quand un visiteur ouvre la page d'accueil du site 
Alors le titre affiché est "VITRAUX"
Et un des points de vue affichés est "Histoire de l'art"
Et un des points de vue affichés est "Histoire des religions"
Et un des corpus affichés est "Vitraux - Bénel"
Et un des corpus affichés est "Vitraux - Recensement"

Scénario: Consulter le portfolio correspondant au serveur virtuel

Soit "indéfini" le portfolio spécifié dans la configuration
Quand un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par "vitraux."
Alors le titre affiché est "VITRAUX"
Et un des points de vue affichés est "Histoire de l'art"
Et un des points de vue affichés est "Histoire des religions"
Et un des corpus affichés est "Vitraux - Bénel"
Et un des corpus affichés est "Vitraux - Recensement"

