#language: fr

Fonctionnalité: Faire une recherche multiple exclusive sur les catégories.

Contexte:
  Soit le point de vue "Histoire de l’art" rattaché au portfolio "vitraux"
  Soit la rubrique  "XIIIe s. " au point de vue "Histoire de l’art"
  Soit la rubrique "restauré" au point de vue "Histoire de l’art"
  Soit l'item "SPSP 036" rattaché à la rubrique "XIIIe s."
  Soit l'item "SU 100" rattaché à la rubrique "restauré"
  Soit l'item "SPSP 009" rattaché à la rubrique "XIIIe s."


Scénario:
  Soit "vitraux" le portfolio ouvert
  Soit les rubriques “XIIIe s.”  sont sélectionnée
  Soit les rubriques “restauré.” sont sélectionnée
  Quand on exclue la rubrique “restauré”
  Alors l'item "SU 100" n’est pas affiché
  Et l'item "SPSP 009" est affiché
