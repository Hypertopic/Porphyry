#language: fr

Fonctionnalité: Créer un item

Contexte:
    Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
    Soit "vitraux" le portfolio ouvert

Scénario:
    Soit l'utilisateur "alice" connecté
    Quand l'utilisateur crée un item "SMV 129" dans le corpus "Vitraux - Bénel"
    Alors l'item "SMV 129" est affiché
