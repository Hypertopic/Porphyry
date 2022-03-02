#language: fr

Fonctionnalité: Créer une rubrique

Scénario: de premier niveau

   Soit un point de vue en cours d'édition
   Et l'utilisateur est connecté
   Quand l'utilisateur crée la rubrique "Technique du verre" à la racine du point de vue
   Alors le point de vue contient la rubrique "Technique du verre"
   
Scénario: sœur d'une autre rubrique

   Soit un point de vue en cours d'édition
   Et "Technique du verre" une des rubriques du point de vue
   Et l'utilisateur est connecté
   Quand l'utilisateur crée la rubrique "Décoration" comme sœur de "Technique du verre"
   Alors le point de vue contient la rubrique "Décoration"


