#language: fr

Fonctionnalité: Combiner les critères de sélection

Scénario: Recherche complexe 1

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Quand l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Personnages"
  Et l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "SM 001 n" est caché
  Quand l'utilisateur change l'opérateur entre la rubrique "Récits" et la rubrique "Personnages"
  Alors l'item "SM 001 n" est affiché

  Scénario: Recherche complexe 2

    Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
    Quand l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Personnages"
    Et l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
    Alors l'item "SM 001 n" est affiché
    Quand l'utilisateur change l'opérateur entre la rubrique "Récits" et la rubrique "Personnages"
    Alors l'item "SM 001 n" est caché
