
#language: fr

Fonctionnalité: Se repérer dans l'espace

Scénario: dans un édifice à un étage

Soit "vitraux" le portfolio ouvert
Quand l'utilisateur recherche "Jean" puis choisit "spatial : Église Saint-Jean-au-Marché, Troyes"
Alors l'item "SJ 100" est au dessus du plan
Et l'item "SJ 000" est au dessus de l'item "SJ 100"
Et l'item "SJ 102" est à droite du plan
Et l'item "SJ 002" est à droite de l'item "SJ 102"
Et l'item "SJ 001" est à gauche du plan

Scénario: avec une recherche

Soit "vitraux" le portfolio ouvert
Soit "spatial : Église Saint-Jean-au-Marché, Troyes" la recherche actuelle
Soit "Personnages" une des rubriques développées
Soit "AT" une des rubriques développées
Quand on choisit la rubrique "Isaac"
Alors l'image item "SJ" est affichée
Et l'image item "SJ 001" est affichée
Mais l'image item "SJ 000" est cachée
Mais l'image item "SJ 100" est cachée
Mais l'image item "SJ 102" est cachée
Mais l'image item "SJ 002" est cachée
Mais l'image item "SJ 020" est cachée
