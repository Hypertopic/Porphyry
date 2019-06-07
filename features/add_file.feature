#language: fr

Fonctionnalité: Ajouter une ressource à un item (en tant que fichier)

Contexte:
  Soit l'item "1997_6-9_23-ex_ECU_R_C" rattaché à la rubrique "Lauréats"
  Soit la rubrique "Lauréats" rattachée au point de vue "Concours"
  Soit le point de vue "Concours" rattaché au portfolio "dessins"

Scénario:
  Soit "dessins" le portfolio ouvert
  Et l'item "1997_6-9_23-ex_ECU_R_C" sélectionné
  Quand on ajoute une ressource "description.txt" à un item
  Alors la ressource "description.txt" est ajoutée à la liste des ressources associées à l'item "1997_6-9_23-ex_ECU_R_C"
  Et le titre de l'item affiché est "1997_6-9_23-ex_ECU_R_C"
