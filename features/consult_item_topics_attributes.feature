#language: fr

Fonctionnalité: Consulter les thèmes et attributs associés à un item

Contexte:
Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"
Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
Soit le thème "Récits" rattaché au point de vue "Histoire des religions"
Soit le thème "Évangile" rattaché au thème "Récits"
Soit le thème "Crucifixion" rattaché au thème "Évangile"
Soit le thème "Datation" rattaché au point de vue "Histoire de l'art"
Soit le thème "XVIe s." rattaché au thème "Datation"
Soit le thème "Personnages" rattaché au point de vue "Histoire des religions" 
Soit le thème "NT" rattaché au thème "Personnages"
Soit le thème "Les larrons" rattaché au thème "NT"
Soit l'item "ACS" rattaché aux thèmes "Crucifixion" et "Datation"
Soit "1907/1914" la valeur de l’attribut "created" rattaché à l’item "ACS"
Soit "ACS" la valeur de l’attribut "name" rattaché à l’item "ACS"

Scénario: Consulter les attributs associés à un item 

Soit "ACS" un item affiché dans la vue courante du visiteur
Quand le visiteur sélectionne l’item "ACS"
Alors le titre de l'item affiché "ACS"
Et "1907/1914" la valeur de l’attribut "created" rattaché à l’item "ACS"
Et "ACS" la valeur de l’attribut "name" rattaché à l’item "ACS"

Scénario: Consulter les thèmes associés à un item 

Soit "ACS" un item affiché dans la vue courante du visiteur
Quand le visiteur sélectionne l’item "ACS"
Alors le titre de l'item affiché "ACS"



