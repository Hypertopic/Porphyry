#language: fr

Fonctionnalité: À partir d'un item, obtenir ceux qui sont dans la même rubrique

Contexte:
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le corpus "Vitraux - Dr. Krieger" rattaché au portfolio "vitraux"
 Soit la rubrique "Donateur" rattachée au point de vue "Histoire de l'art"
 Soit la rubrique "Figuration du donateur" contenue dans la rubrique "Donateur"
 Soit l'item "BSS 007" rattaché à la rubrique "Figuration du donateur"
 Soit l'item "BSS 018" rattaché à la rubrique "Figuration du donateur"

Scénario:

 Soit "BSS 007" l'item affiché
 Quand on choisit la rubrique "Figuration du donateur"
 Alors le titre affiché est "VITRAUX"
 Et l'item "BSS 007" est affiché
 Et l'item "BSS 018" est affiché
 Et les rubriques "Figuration du donateur" sont sélectionnées
