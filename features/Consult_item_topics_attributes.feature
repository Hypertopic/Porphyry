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
 Soit l'item "ABT" rattaché aux thèmes "Crucifixion" et "Datation"
 Soit "1907/1914" la valeur de l’attribut "created" rattaché à l’item "ABT"
 Soit "ABT" la valeur de l’attribut "name" rattaché à l’item "ABT"

Scénario: Consulter les attributs associés à un item 

 Soit "ABT" un item affiché dans la vue courante du visiteur
 Quand le visiteur sélectionne l’item "ABT"
 Alors le titre de l’item affiché est "ABT"
 Et "1907/1914" la valeur de l’attribut "created" rattaché à l’item "ABT"
 Et "ABT" la valeur de l’attribut "name" rattaché à l’item "ABT"

Scénario: Consulter les thèmes associés à un item 

 Soit "ABT" un item affiché dans la vue courante du visiteur
 Quand le visiteur sélectionne l’item "ABT"
 Alors le titre affiché est "ABT"
 Et un des points de vue affichés est "Histoire de l'art" 
 Et un des points de vue affichés est "Histoire des religions" 
 Et un des thèmes affichés du point de vue "Histoire de l'art" est "Datation"
 Et un des thèmes affichés rattaché au thème "Datation" est "XVIe s."
 Et un des thèmes affichés du point de vue "Histoire des religions" est "Récits"
 Et un des thèmes affichés rattaché au thème "Récits" est "Évangile"
 Et un des thèmes affichés rattaché au thème "Évangile" est "Crucifixion"
 Et un des thèmes affichés du point de vue "Histoire des religions" est "Personnages"
 Et un des thèmes affichés rattaché au thème "Personnages" est "NT"
 Et un des thèmes affichés rattaché au thème "NT" est "Les larrons"


