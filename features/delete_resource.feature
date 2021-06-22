#language: fr

Fonctionnalité: Retirer une ressource à un item

Scénario: Retirer une ressource
    Soit "AXN 009" l'item affiché
    Et la ressource "AXN_009_description.pdf" est visible
    Quand l'utilisateur retire la ressource "AXN_009_description.pdf"
    Alors il n'y a pas de ressource "AXN_009_description.pdf" visible

Scénario: Annulation de la suppression
    Soit "AXN 009" l'item affiché
    Et la ressource "AXN_009_description.pdf" est visible
    Quand l'utilisateur retire la ressource "AXN_009_description.pdf" et annule cette suppression
    Alors la ressource "AXN_009_description.pdf" est visible