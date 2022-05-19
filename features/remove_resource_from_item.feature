#language: fr

Fonctionnalité: Supprimer une ressource appartenant à un item

  Scénario: Supprimer une ressource appartenant à un item

    Soit "AXN 009" l'item affiché
    Et l'utilisateur est connecté
    Et la ressource "favicon.ico" existe comme ressource
    Quand l'utilisateur supprime la ressource "favicon.ico"
    Alors la ressource "favicon.ico" est supprimée

