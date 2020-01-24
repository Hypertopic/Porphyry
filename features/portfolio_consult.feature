#language: fr

Fonctionnalité: Consulter un portfolio

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

