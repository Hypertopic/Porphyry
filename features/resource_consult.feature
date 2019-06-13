#language: fr

Fonctionnalité: Consulter les ressources associées à un item

Contexte:
  Soit l'item "1997_6-9_23-ex_ECU_R_C" rattaché à la rubrique "Lauréats"
  Soit la rubrique "Lauréats" rattachée au point de vue "Concours"
  Soit le point de vue "Concours" rattaché au portfolio "dessins"

Scénario:
  Soit "dessins" le portfolio ouvert
  Quand on choisit l'item "1997_6-9_23-ex_ECU_R_C"
  Alors une des ressources de l'item est "description.txt"
