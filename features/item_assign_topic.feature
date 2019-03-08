#language: fr

Fonctionnalité: Décrire un item à l'aide d'une rubrique selon un point de vue

Contexte:
  Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
  Soit la rubrique "Ateliers du Carmel du Mans" rattachée au point de vue "Histoire de l'art"
  Soit l'item "ACS" non rattaché à la rubrique "Ateliers du Carmel du Mans"

Scénario:
  Soit "vitraux" le portfolio ouvert
  Soit "ACS" l'item affiché
  Quand on entre "Atelier" dans le champ "Ajouter une rubrique" du point de vue "Histoire de l'art"
  Alors les suggestions "Artiste > ATELIERs du Carmel du Mans", "Artiste > ATELIER Gontier" et "Artiste > ATELIER Miller" s'affichent pour le champ "Ajouter une rubrique" du point de vue "Histoire de l'art"

  Soit les suggestions "Artiste > ATELIERs du Carmel du Mans", "Artiste > ATELIER Gontier" et "Artiste > ATELIER Miller" affichées pour le champ "Ajouter une rubrique" du point de vue "Histoire de l'art"
  Quand on sélectionne "Artiste > ATELIERs du Carmel du Mans" dans le champ "Ajouter une rubrique" du point de vue "Histoire de l'art"
  Alors le champ "Ajouter une rubrique" du point de vue "Histoire de l'art" est rempli avec "Artiste > ATELIERs du Carmel du Mans"
  Et le bouton de validation du champ "Ajouter une rubrique" du point de vue "Histoire de l'art" est activé

  Soit le champ "Ajouter une rubrique" du point de vue "Histoire de l'art" rempli avec "Artiste > ATELIERs du Carmel du Mans"
  Soit le bouton de validation du champ "Ajouter une rubrique" du point de vue "Histoire de l'art" activé
  Quand on clique sur le bouton de validation
  Alors la rubrique "Artiste > Ateliers du Carmel du Mans" est ajoutée à l'item "ACS"
