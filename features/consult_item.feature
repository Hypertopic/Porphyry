#language: fr

Fonctionnalité: Consulter un item

Contexte:
  Soit la page d un vitrail avec comme attribut "created 2016-07-02"
  Et comme attribut "name DSN 006 a"
  Et avec un point de vue "Histoire des religions"
  Et avec un point de vue "Histoire de l'art"
  Et avec comme thème "Naissance de Marie"
  Et avec comme thème "Anne (mère de Marie)"
  Et avec comme thème "Marie (mère de jésus)"
  Et avec comme thème "Datation 1862"
  Et avec comme thème "Artiste Ateliers du Carmel du Mans"


Scénario: Consulter un item spécifique
  Quand un visiteur accède à la page d'accueil et clique sur le vitrail "DSN 006 A"
  Alors un titre s affiche avec le nom du vitrail ici "DSN 006 A"
  Et une image du vitrail apparaît
  Et apparaît l attribut du document "creator Aurélien Bénel"
  Et apparaît l attribut du document "spatial Église Saint-Pierre, Dosnon"
  Et apparaît l attribut du document "name DSN 006 a"
  Et apparaît l attribut du document "created 2016-07-02"
  Et apparaît le point de vue "Histoire des religions"
  Et apparaît le point de vue "Histoire de l'art"
  Et apparaît le thème "Naissance de Marie"
  Et apparaît le thème "Anne (mère de Marie)"
  Et apparaît le thème "Marie (mère de Jésus)"
  Et apparaît le thème "1862"
  Et apparaît le thème "Ateliers du Carmel du Mans"
