#language: fr

Fonctionnalité: Renommer une rubrique

Contexte:
    Soit la rubrique "1495" rattachée au point de vue "Histoire de l'art"

Scénario:
    Soit le point de vue "Histoire de l'art" est en cours de modification
    Quand on modifie le nom de la rubrique de "1495" à "1492"
    Alors le nom du rubrique est maintenant "1492"
    Et sur le menu principale, on trouve une rubrique "1492"
    Et sur le menu principale, on ne trouve pas de rubrique "1495"
