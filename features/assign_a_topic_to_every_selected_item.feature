#language: fr

Fonctionnalité: Ajouter une rubrique à tous les items séléctionnés

Contexte:
   Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
   Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"

   Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
   Soit le corpus "Vitraux - Recensement" rattaché au portfolio "vitraux"
   Soit le corpus "Vitraux - Dr. Krieger" rattaché au portfolio "vitraux"

   Soit la rubrique "XIXe s." rattachée au point de vue "Histoire de l'art"
   Soit la rubrique "Technique du verre" rattachée au point de vue "Histoire de l'art"

   Soit l'item "DSN 000" rattaché à la rubrique "XIXe s."
   Soit l'item "DSN 001" rattaché à la rubrique "XIXe s."
   Soit l'item "DSN 002" rattaché à la rubrique "XIXe s."
   Soit l'item "DSN 004" rattaché à la rubrique "XIXe s."
   Soit l'item "DSN 005" rattaché à la rubrique "XIXe s."

Scénario:
  Soit "vitraux" le portfolio ouvert
  Et l'utilisateur est connecté
  Et "Datation" une des rubriques développées
  Et la rubrique "XIXe s." sélectionnée
  Et le mode sélection activé
  Quand on attribue la rubrique "Technique du verre" aux items "DSN 000", "DSN 001", "DSN 002", "DSN 004", et "DSN 005"
  Alors les items "DSN 000", "DSN 001", "DSN 002", "DSN 004" et "DSN 005" ont la rubrique "Technique du verre"
  
