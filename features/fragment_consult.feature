#language: fr

Fonctionnalité: Consulter les items en mode fragment

  Contexte:
    Soit le corpus "enseignants-decrocheurs" rattaché au portfolio "alice"

    Soit l'item "David1" rattaché au corpus "enseignants-decrocheurs"
    Soit l'item "David2" rattaché au corpus "enseignants-decrocheurs"
    Soit l'item "Karine" rattaché au corpus "enseignants-decrocheurs"

    Soit le point de vue "Sociologie de la douleur" rattaché à l'item "David1"
    Soit la rubrique "souffrir de plus en plus" rattachée au point de vue "Sociologie de la douleur"
    Soit le fragment "Quand je suis rentré comme professeur, j'étais un h" rattaché à la rubrique "souffrir de plus en plus"

  Scénario: Afficher la liste des items
    Soit "alice" le portfolio ouvert
    Alors il doit y avoir au moins 3 items affichés
    Et l'item "David1" est décrit par une date
    Et l'item "David1" est décrit par un auteur

  Scénario: Afficher les fragments associé à l'item "David1"
    Soit "alice" le portfolio ouvert
    Et l'item "David1" est affiché
    Quand l'item "David1" est selectionné
    Alors la rubrique "souffrir de plus en plus" est affichée
    Et le fragment "Quand je suis rentré comme professeur, j'étais un h" est affiché
    Et le lien vers le texte "David1" associé au fragment "Quand je suis rentré comme professeur, j'étais un h" est affiché