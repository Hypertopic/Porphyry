#language: fr

Fonctionnalité: Les items restent séléctionnées après avoir consulté un item


Scénario: Les rubriques restent séléctionnées après avoir consulté un item

    Soit "Abram/Abraham" les rubriques sélectionnées
    Quand l'utilisateur choisit l'item "SM 001 n" parmi les items affichés
    Et l'utilisteur clique sur "Retour à l'accueil"
    Alors "Abram/Abraham" sont des rubriques sélectionnées
 
Scénario: Les rubriques restent déséléctionnées après avoir consulté un item

    Soit "Abram/Abraham" les rubriques désélectionnées
    Quand l'utilisateur choisit l'item "SNZ 009" parmi les items affichés
    Et l'utilisteur clique sur "Retour à l'accueil"
    Alors "Abram/Abraham" sont des rubriques sélectionnées négativement

 Scénario: Les rubriques restent déséléctionnées après avoir consulté une succession d'item lié

    Soit "Abram/Abraham" les rubriques désélectionnées
    Quand l'utilisateur choisit l'item "AXN 009" parmi les items affichés
    Et l'utilisateur choisit l'item "AXN 009" dans le bloc Items ayant le même nom
    Et l'utilisteur clique sur "Retour à la visite"
    Alors "Abram/Abraham" sont des rubriques sélectionnées négativement
