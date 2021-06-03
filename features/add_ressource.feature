#language: fr

Fonctionnalité: Ajouter une ressource à un item

Scénario: Ajouter une ressource
    Soit vitraux le portfolio ouvert
    Et "AXN 009" l'item affiché
    Quand l'utilisateur ajoute la ressource "vitrail_provenance.pdf"
    Alors la ressource "vitrail_provenance.pdf" est visible

Scénario: Annulation de l'ajout
    Soit vitraux le portfolio ouvert
    Et "AXN 009" l'item affiché
    Quand l'utilisateur annule l'ajout de la ressource "vitrail_provenance.pdf"
    Alors la ressource "vitrail_provenance.pdf" est cachée


