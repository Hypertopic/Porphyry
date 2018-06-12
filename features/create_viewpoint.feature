#language: fr

Fonctionnalité: Créer un viewpoint

Soit un nouveau nom de viewpoint généré

Scénario: Accéder à la page de création de viewpoint
Soit l'utilisateur ouvre la page d'accueil du site
Quand l'utilisateur crée un nouveau viewpoint
Alors la page de viewpoint s'ouvre
Et la page de viewpoint contient un champ de texte dans le titre
Et la page de viewpoint contient un bouton homepage

Scénario: Créer un viewpoint

Soit l'utilisateur ouvre la page de création de nouveau viewpoint
Quand l'utilisateur entre le nom de viewpoint
Alors le champ de texte disparaît
Et le titre de page devient le nom de viewpoint

Scénario: Visualiser le viewpoint créé

Soit l'utilisateur ouvre la page de création de nouveau viewpoint
Quand l'utilisateur revient au portfolio
Alors le portfolio contient le nom de viewpoint