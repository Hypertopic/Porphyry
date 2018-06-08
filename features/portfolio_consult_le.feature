#language: fr

Fonctionnalité: Pour chaque topic, récupérer le nombre d'items sélectionnés qui lui sont assignés # (#37)

Contexte:

    Soit la page d'accueil est ouvert

Scénario: Récupérer le nombre d'items sélectionnés assignés à un topic

    Soit le topic "Artiste" est affiché sur la page
    Quand un utilisateur ouvre le topic "Artiste" et clique sur le topic "Atelier Gontier"
    Alors Le topic "Atelier Gontier" doit contenir au moins 9 items
