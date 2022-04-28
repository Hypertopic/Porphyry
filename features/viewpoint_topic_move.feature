#language: fr

Fonctionnalité: Déplacer une rubrique et ses descendantes

Scénario: sous une autre rubrique

   Soit un portfolio ouvert
   Et l'utilisateur est connecté
   Et un point de vue en cours d'édition
   Et "XIIe s." une des rubriques du point de vue
   Et "Fin du XIIe s." une rubrique fille de "XIIe s."
   Et "Datation" une des rubriques du point de vue
   Quand l'utilisateur déplace "XIIe s." sous "Datation"
   Alors "XIIe s." est une rubrique fille de "Datation"
   Et "fin du XIIe s." est une rubrique fille de "XIIe s."

Scénario: à la racine du point de vue

   Soit un portfolio ouvert
   Et l'utilisateur est connecté
   Et un point de vue en cours d'édition
   Et "Récits" une des rubriques du point de vue
   Et "Personnages" une rubrique fille de "Récits"
   Et "extrascrituraires" une rubrique fille de "Personnages"
   Quand l'utilisateur déplace "Personnages" à la racine du point de vue
   Alors "Personnages" est à la racine du point de vue
   Et "extrascripturaires" est une rubrique fille de "Personnages"

