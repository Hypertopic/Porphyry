#language: fr

Fonctionnalité: Déplacer une rubrique et ses descendantes

Scénario: sous une autre rubrique

   Soit un point de vue en cours d'édition
   Et "XIIe s." une des rubriques du point de vue
   Et "Fin du XIIe s." une rubrique fille de "XIIe s."
   Et "Datation" une des rubriques du point de vue
   Et l'utilisateur est connecté
   Quand l'utilisateur déplace "XIIe s." sous "Datation"
   Alors "XIIe s." est une rubrique fille de "Datation"
   Et "fin du XIIe s." est une rubrique fille de "XIIe s."


