#language: fr

Fonctionnalité: Combiner les critères de sélection et comparer le nombre de résultats

Scénario: comparaison "not(A) or (not(B) or not(C))" et "not(A) or (not(B) and not(C))" - Largest

    Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
    Quand l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Personnages"
    Alors l'item "SM 001 m" est caché
    Et l'utilisateur change l'opérateur entre la rubrique "Datation" et la rubrique "Récits"
    Alors l'item "SM 001 m" est affiché

Scénario: comparaison "not(A) and (not(B) or not(C))" et "not(A) and (not(B) and not(C))" - Smallest

    Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
    Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
    Alors l'item "SNZ 005" est affiché
    Et l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
    Alors l'item "SNZ 005" est caché