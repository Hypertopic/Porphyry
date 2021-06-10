#language: fr

Fonctionnalité: Ajouter une ressource à un item

Scénario: Ajouter une ressource
    Soit "AXN 009" l'item affiché
    Quand l'utilisateur ajoute la ressource "AXN_009_description.pdf"
    Alors la ressource "AXN_009_description.pdf" est visible

Scénario: Annulation de l'ajout
    Soit "AXN 009" l'item affiché
    Quand l'utilisateur ajoute ressource "AXN_009_description.pdf" et annule ce nouvel ajout
    Alors il n'y a pas de ressource "AXN_009_description.pdf" visible

