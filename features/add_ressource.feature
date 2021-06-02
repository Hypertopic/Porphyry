#language: fr

Fonctionnalité: Ajouter une ressource à un item

Scénario : Afficher le popup d'ajout des ressources
    Soit vitraux le portfolio ouvert
    Et "AXN 009" l'item affiché
    Quand l'utilisateur clique sur "ajouter une pièce jointe"
    Alors le popup "ajout de ressources" est affiché


Scénario : Ajouter un élément depuis l'explorateur de fichiers
    Soit vitraux le portfolio ouvert
    Et "AXN 009" l'item affiché
    Et le popup "ajout de ressources" est visible
    Quand l'utilisateur clique sur "parcourir"
    Alors il peut sélectionner un fichier


Scénario : Annulation de l'ajout
    Soit vitraux le portfolio ouvert
    Et "AXN 009" l'item affiché
    Et le popup "ajout de ressources" est visible
    Quand l'utilisateur clique sur "annuler"
    Alors le popup "ajout de ressources" est caché


Scénario : Validation de l'ajout
    Soit vitraux le portfolio ouvert
    Et "AXN 009" l'item affiché
    Et le popup "ajout de ressources" est visible
    Et un fichier a été sélectionné
    Quand l'utilisateur clique sur "ajouter"
    Alors le popup "ajout de ressources" est caché
    Et la ressource est affichée