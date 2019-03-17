#language: fr

Fonctionnalité: Créer une catégorie

Contexte:
  Soit le point de vue "Histoire de l'art" rattaché au portefolio "vitraux"
  Soit la catégorie "Datation" rattaché au point de vue "Histoire de l'art"
  Soit la catégorie "XXIe s." contenue dans la catégorie "Datation"

Scénario: Ajouter la catégorie fille "2019" à la catégorie "XXIe s." du point de vue "Histoire de l'art"
  Soit la page de modification du point de vue "Histoire de l'art" est affiché
  Et la catégorie "Datation" est déplié
  Quand on ajoute la sous-catégorie "2019" à la catégorie "XXIe s."
  Alors la catégorie "2019" apparait dans l'arborescence
