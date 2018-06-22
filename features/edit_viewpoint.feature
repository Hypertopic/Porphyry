#language: fr

Fonctionnalité: Editer un point de vue

Scénario: Créer un point de vue

Soit l`utilisateur dans le portfolio
Quand l`utilisateur clique le bouton Nouveau point de vue
Et l`utilisateur entre "Mon nouveau pdv" comme le nom de point de vue et tappe Entrée
Et l`utilisateur revient au portfolio en cliquant Retour à l'accueil
Alors le point de vue "Mon nouveau pdv" est affiché

Scénario: Renommer un point de vue

Soit l`utilisateur dans le portfolio
Quand l`utilisateur clique le bouton de modification de point de vue "Mon nouveau pdv" et ouvre la page de modification de point de vue
Et l`utilisateur clique le bouton de modification à côté de "Mon nouveau pdv"
Et l`utilisateur change le nom du point de vue "Mon nouveau pdv" en "My viewpoint" et tappe Entrée
Et l`utilisateur revient au portfolio en cliquant Retour à l'accueil
Alors le point de vue "My viewpoint" est affiché
Et le point de vue "Mon nouveau pdv" n'est plus affiché

Scénario: Supprimer un point de vue

Soit l`utilisateur dans le portfolio
Quand l`utilisateur clique le bouton de suppression de point de vue "My viewpoint" et accept l'avertissement
Alors le point de vue "My viewpoint" n'est plus affiché