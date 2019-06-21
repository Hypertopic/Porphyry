#language: fr

Fonctionnalité: Rechercher des items en utilisant les opérations booléennes basiques

Contexte:
    Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
    Soit la rubrique "Armoiries du donateur" rattachée au point de vue "Histoire de l'art"
    Soit la rubrique "XIIIe s." rattachée au point de vue "Histoire de l'art"

Scénario:
    Soit "vitraux" le portfolio ouvert
    Soit "Donateur" une des rubriques développées
    Soit "Datation" une des rubriques développées
    Soit la rubrique "Armoiries du donateur" est visible et sélectionnée
    Soit la rubrique "XIIIe s." est visible et sélectionnée
    Quand l'utilisateur sélectionne "Et" entre la rubrique "XIIIe s." et la rubrique "Armoiries du donateur"
    Alors l'item "SMV 102" est affiché
    Et l'item "SMV 100" est affiché
    Et l'item "SMV 101" est affiché
    Et l'item "SMV 105" est affiché
    Et l'item "SP 102" est affiché
    Et l'item "SP 110" est affiché
    Et l'item "SPSP 009" est affiché
    Et l'item "SPSP 209" est affiché
    Et l'item "SU 100" est affiché
