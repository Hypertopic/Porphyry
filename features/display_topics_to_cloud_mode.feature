#language: fr

Fonctionnalité: Afficher la vue nuage de mot pour les catégories

Contexte:

Soit le corpus "enseignants-décrocheurs" rattaché au portfolio "alice"

Soit l'item "David1" rattaché au corpus "enseignants-décrocheurs"
Soit l'item "David2" rattaché au corpus "enseignants-décrocheurs"
Soit l'item "Karine" rattaché au corpus "enseignants-décrocheurs"

Soit le point de vue "Grille d'analyse du SI" rattaché au portfolio "alice"
Soit la rubrique "Action" rattachée au point de vue "Grille d'analyse du SI"
Soit la rubrique "Acteur" rattachée au point de vue "Grille d'analyse du SI"

Soit le fragment "regarder la télévision" contenu dans la rubrique "Action"
Soit le fragment "mes collègues" contenu dans la rubrique "Acteur"

Soit les rubriques affichées en liste

Scénario: Switcher vers la vue nuage de mots

  Soit "alice" le portfolio ouvert
  Quand un visiteur change de vue vers nuage de mots
  Alors la rubrique "Action" est plus grosse que "Acteur"

Scénario: Sélectionner une catégorie du nuage de mot

   Soit "alice" le portfolio ouvert
   Et la vue nuage de mot est séléctionnée
   Quand un visiteur séléctionne la rubrique "Action"
   Alors la rubrique "Action" est surlignée