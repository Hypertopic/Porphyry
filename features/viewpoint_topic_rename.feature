#language: fr

Fonctionnalité: Renommer une rubrique

Scénario:

   Soit un point de vue en cours d'édition
   Et "Époque" une des rubriques du point de vue
   Et l'utilisateur est connecté
   Quand l'utilisateur renomme "Datation" la rubrique nommée "Époque"
   Alors le point de vue contient la rubrique "Datation"
   Et le point de vue ne contient pas la rubrique "Époque"

