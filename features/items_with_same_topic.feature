#language: fr

Fonctionnalité: A partir d'un item, obtenir ceux qui ont le même thème

Contexte:
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le corpus "Vitraux - Dr. Krieger" rattaché au portfolio "vitraux"
 Soit le regroupement de thèmes "Donateur" rattaché au point de vue "Histoire de l'art"
 Soit le thème "Figuration du donateur" rattaché au regroupement de thèmes "Donateur"
 Soit l‘item "BSS 007" lié au thème "Figuration du donateur"
 Soit l‘item "BSS 018" lié au thème "Figuration du donateur"

Scénario: A partir d'un item, obtenir ceux qui ont le même thème

 Soit l‘item affiché "BSS 007"
 Quand un visiteur clique sur le thème "Figuration du donateur"
 Alors le titre affiché est "VITRAUX"
 Et l‘item "BSS 007" est visible sur la page
 Et l‘item "BSS 018" est visible sur la page
 Et le thème "Figuration du donateur" est visible sur la page
 Et le thème "Figuration du donateur" est sélectionné
