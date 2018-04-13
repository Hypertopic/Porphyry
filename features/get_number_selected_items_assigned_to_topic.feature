#language: fr

Fonctionnalité: Pour chaque topic, récupérer le nombre d'items sélectionnés qui lui sont assignés # (see #37)

Contexte:

    Soit la page d'accueil chargée

Scénario: Récupérer le nombre d'items sélectionnés assignés à un topic

    Soit le topic "Ateliers du Carmel du Mans" présent sur la page
    Quand un utilisateur clique sur le topic "Ateliers du Carmel du Mans"
    Alors Il doit y avoir au moins 21 items inscrits à côté de "Ateliers du Carmel du Mans"
