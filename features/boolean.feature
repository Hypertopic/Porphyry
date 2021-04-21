#language: fr

Fonctionnalité: Requete complexe

Scénario: Requete complexe 1

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Personnages"
  Et l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 m" est caché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 m" est affiché

Scénario: Requete complexe 2

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SNZ 005" est affiché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SNZ 005" est caché
