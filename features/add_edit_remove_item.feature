#language: fr

Fonctionnalité: Créer, modifier et supprimer un rubrique

Contexte:
  Soit le corpus "Histoire de l'art" rattaché au portfolio "vitraux"

Scénario: Créer une rubrique
	Soit un visiteur sur la page d'édition du point de vue "Histoire de l'art"
  Soit l'utilisateur "alice" connecté
  Quand l'utilisateur crée la rubrique "Origine"
  Alors l'item "Origine" est affiché

Scénario: Modifier la rubrique
  Soit un visiteur sur la page d'édition du point de vue "Histoire de l'art"
  Soit l'utilisateur "alice" connecté
  Soit la rubrique "Origine" rattachée au point de vue "Histoire de l'art"
  Quand un visiteur modifie le nom de la rubrique "Origine" en "Origines"
  Alors un des corpus affichés est "Origines"

Scénario: Supprimer une rubrique
  Soit un visiteur sur la page d'édition du point de vue "Histoire de l'art"
  Soit l'utilisateur "alice" connecté
  Soit la rubrique "Origines" rattachée au point de vue "Histoire de l'art"
  Quand l'utilisateur supprime la rubrique "Origines"
  Alors l'item "Origines" n'est pas affiché
