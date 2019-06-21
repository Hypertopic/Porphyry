#language: fr

Fonctionnalité: Faire une recherche multiple exclusive sur les catégories.

  Contexte:
    Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
    Soit la rubrique "Armoiries du donateur" rattachée au point de vue "Histoire de l'art"
    Soit la rubrique "1625" rattachée au point de vue "Histoire de l'art"

  Scénario:
    Soit "vitraux" le portfolio ouvert
    Soit "Donateur" une des rubriques développées
    Soit "Datation" une des rubriques développées
    Soit la rubrique "Armoiries du donateur" est visible et sélectionnée
    Soit la rubrique "1625" est visible et sélectionnée
    Quand l'utilisateur exclue la rubrique "1625"
    Alors l'item "SMV 102" n'est pas affiché
    Et l'item "SMV 100" est affiché
    Et l'item "SMV 101" est affiché
    Et l'item "SMV 105" est affiché
    Et l'item "SP 102" est affiché
    Et l'item "SP 110" est affiché
