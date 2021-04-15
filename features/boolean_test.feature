#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: Requete complexe - Largest

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Personnages"
  Et l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 m" est affiché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 m" est caché

Scénario: Requete complexe - Smallest

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SNZ 005" est affiché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SNZ 005" est caché 