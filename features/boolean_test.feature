#language: fr

Fonctionnalité: Selectionner des items en cherchant

Scénario: Requête complexe 1 (le plus grand)

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Personnages"
  Et l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 m" est affiché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 m" est caché

Scénario: Requête complexe 2 (le plus petit)

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 005" est affiché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 005 m" est caché
