#language: fr

Fonctionnalité: Dupliquer un portfolio pour un usage privé

Contexte:

    Soit "vitraux" le portfolio ouvert
    Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"
    Soit le corpus "Vitraux - Dr. Krieger" rattaché au portfolio "vitraux"

Scénario: Dupliquer un portfolio

    Soit l'utilisateur est connecté
    Quand on créé une copie du portfolio appelée "undefined" avec le corpus "Vitraux - Dr. Krieger" et le point de vue "Histoire des religions"
    Alors le titre affiché est "undefined"
    Et un des corpus affichés est "Vitraux - Dr. Krieger"
    Et un des points de vue affichés est "Histoire des religions"
