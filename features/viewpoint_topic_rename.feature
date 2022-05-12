#language: fr

Fonctionnalité: Renommer une rubrique

Scénario:

   Soit un portfolio ouvert
   Et l'utilisateur est connecté
   Et un point de vue en cours d'édition
   Et "Époque" une des rubriques du point de vue
   Quand l'utilisateur renomme "Datation" la rubrique nommée "Époque"
   Alors le point de vue contient la rubrique "Datation"
   Et le point de vue ne contient pas la rubrique "Époque"

