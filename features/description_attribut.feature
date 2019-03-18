#language: fr

Fonctionnalité: Pour un item, décrire les attributs qui le caractérisent

Contexte:

    Soit le corpus "Vitraux-Bénel" rattaché au portfolio "Vitraux"
    Soit l'item "ACS" rattaché à la rubrique "XVe s."
    Soit le point de vue "Histoire de l'art" rattaché au portfolio "Vitraux"
    Soit la rubrique "XVe s." rattachée au point de vue "Histoire de l'art"
    Soit "7 Fi 47" la valeur de l'attribut "ref" de l'item "ACS"


Scénario: Ajouter un attribut à un item

    Soit l'item "ACS" affiché
    Soit l'utilisateur est connecté
    Quand on ajoute un attribut "license" avec pour valeur "CC0"
    Alors un nouvel attribut "license" avec pour valeur "CC0" est affiché


Scénario: Supprimer un attribut d\'un item

    Soit l'item "ACS" affiché
    Quand on supprime l'attribut "license" ayant pour valeur "CC0"
    Alors l'attribut "license" ayant pour valeur "CC0" n'est plus affiché
    Et l'utilisateur se déconnecte
