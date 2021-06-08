#language: fr

Fonctionnalité: Ajouter une ressource à un item

Scénario: Ajouter une ressource
    Soit "AXN 009" l'item affiché
    Quand l'utilisateur ajoute la ressource "test.pdf"
    Alors la ressource "test.pdf" est visible

Scénario: Annulation de l'ajout
    Soit "AXN 009" l'item affiché
    Quand l'utilisateur ajoute ressource "test.pdf" et annule ce nouvel ajout
    Alors la ressource "test.pdf" est cachée


