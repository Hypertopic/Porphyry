#language: fr

Fonctionnalité: Supprimer une rubrique

Scénario:

   Soit un portfolio ouvert
   Et l'utilisateur est connecté
   Et un point de vue en cours d'édition
   Et "Cheval" une des rubriques du point de vue
   Quand l'utilisateur supprime la rubrique nommée "Cheval"
   Alors le point de vue ne contient pas la rubrique "Cheval"

