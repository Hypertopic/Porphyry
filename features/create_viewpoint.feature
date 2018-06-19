#language: fr

Fonctionnalité: Créer un point de vue

Soit un nouveau nom de point de vue généré

Scénario: Accéder à la page de création de point de vue
Soit l'utilisateur ouvre la page d'accueil du site
Quand l'utilisateur crée un nouveau point de vue
Alors la page de point de vue s'ouvre
Et la page de point de vue contient un champ de texte dans le titre
Et la page de point de vue contient un bouton homepage

Scénario: Créer un point de vue

Soit l'utilisateur ouvre la page de création de nouveau point de vue
Quand l'utilisateur entre le nom de point de vue
Alors le champ de texte disparaît
Et le titre de page devient le nom de point de vue

Scénario: Visualiser le point de vue créé

Soit l'utilisateur ouvre la page de création de nouveau point de vue
Quand l'utilisateur revient au portfolio
Alors le portfolio contient le nom de point de vue

Scénario: Faire de ménage

Quand l`utilisateur finit ce test
Alors le point de vue créé est supprimé