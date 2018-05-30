#language: fr

Fonctionnalité: Pour chaque topic, récupérer le nombre d'items sélectionnés qui lui sont assignés

Contexte:
 Soit la page d'accueil chargée


Scénario: Sélectionner le topic "Hugot"
 Quand un utilisateur visite la page d'accueil
 Alors le portfolio "VITRAUX" est présent
 Et le viewpoint "Histoire de l'art" est présent
 Et le viewpoint "Histoire des religions" est présent
 Et le topic "Artiste" est présent
 Et le topic "Hugot" est présent
 Et le topic "Datation" est présent
 Et le topic "XIXe s." est présent
 Et le topic "XVIe s." est présent
 Et le topic "1883" est présent
 Et le topic "début XVIe" est présent
 Et le topic "Technique du verre" est présent
 Et le topic "Grisaille" est présent
 Et le topic "Jaune d'argent" est présent
 Et le topic "Récits" est présent
 Et le topic "Évangile" est présent
 Et le topic "selon Matthieu" est présent
 Et le topic "Origines de Jésus (arbre de Jessé)" est présent

 Quand un utilisateur clique sur le topic "Hugot"
 Alors le nombre d'item 1 est affiché à côté du topic "Artiste"
 Et le nombre d'item 1 est affiché à côté du topic "Hugot"
 Et le nombre d'item 1 est affiché à côté du topic "Datation"
 Et le nombre d'item 1 est affiché à côté du topic "XIXe s."
 Et le nombre d'item 1 est affiché à côté du topic "1883"
 Et le nombre d'item 1 est affiché à côté du topic "XVIe s."
 Et le nombre d'item 1 est affiché à côté du topic "début XVIe"
 Et le nombre d'item 1 est affiché à côté du topic "Technique du verre"
 Et le nombre d'item 1 est affiché à côté du topic "Grisaille"
 Et le nombre d'item 1 est affiché à côté du topic "Jaune d'argent"
 Et le nombre d'item 1 est affiché à côté du topic "Récits"
 Et le nombre d'item 1 est affiché à côté du topic "Évangile"
 Et le nombre d'item 1 est affiché à côté du topic "selon Matthieu"
 Et le nombre d'item 1 est affiché à côté du topic "Origines de Jésus (arbre de Jessé)"
