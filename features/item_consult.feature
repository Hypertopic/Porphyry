#language: fr

Fonctionnalité: Consulter les rubriques et attributs associés à un item

Contexte:
Soit l'item "AL" rattaché à la rubrique "Crucifixion"
Soit la rubrique "Crucifixion" contenue dans la rubrique "Évangile"
Soit la rubrique "Évangile" contenue dans la rubrique "Récits"
Soit la rubrique "Récits" rattachée au point de vue "Histoire des religions"
Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"
Soit l'item "AL" rattaché à la rubrique "XVIe s."
Soit la rubrique "XVIe s." contenue dans la rubrique "Datation"
Soit la rubrique "Datation" rattachée au point de vue "Histoire de l'art"
Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
Soit "1907/1914" la valeur de l'attribut "created" de l'item "AL"

Scénario:

Soit "vitraux" le portfolio ouvert
Quand on choisit l'item "AL"
Alors le titre de l'item affiché est "AL"
Et la valeur de l'attribut "created" est "1907/1914"
Et une des rubriques de l'item est "Crucifixion"
Et une des rubriques de l'item est "XVIe s."
