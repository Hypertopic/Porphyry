
#language: fr

Fonctionnalité: Créer une catégorie

Contexte:

  Soit la page d'accueil ouverte
  Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
  Soit la rubrique "Datation" rattachée au point de vue "Histoire de l'art"
  Soit la rubrique "XIVe s." rattachée à la rubrique "Datation"


Scénario: Créer une catégorie fille
  Soit le visiteur clique sur le bouton à coté du point de vue "Histoire de l'art"
  Soit la page "Modification du point de vue" du point de vue "Histoire de l'art" est ouverte
  Quand un visiteur clique sur la rubrique "Datation"
  Et presse la touche "Entrée"
  Et presse la touche "Tabulation"
  Et tape "XXIIe s."
  Alors la catégorie "XXIIe s." est affichée sous la rubrique "XIVe s."
