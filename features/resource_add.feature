#language: fr

Fonctionnalité: Ajouter une ressource à un item (en tant que fichier)

Contexte:
  Soit l'item "1997_6-9_23-ex_ECU_R_C" rattaché à la rubrique "Lauréats"
  Soit la rubrique "Lauréats" rattachée au point de vue "Concours"
  Soit le point de vue "Concours" rattaché au portfolio "dessins"

Scénario:
  Soit "dessins" le portfolio ouvert
  Soit l'utilisateur connecté
  Soit  "1997_6-9_23-ex_ECU_R_C" l'item affiché
  Quand on ajoute une ressource "test.txt" à un item
  Alors une des ressources de l'item est "test.txt"
