#language: fr

Fonctionnalité: Pour chaque topic, récupérer le nombre d'items sélectionnés qui lui sont assignés

Contexte:
 Soit la page d'accueil chargée


Scénario: Sélectionner le topic "Hugot"
 Quand un utilisateur visite la page d'accueil

 Alors le viewpoint "Histoire de l'art" rattaché au portfolio "VITRAUX"
 Et le viewpoint "Histoire des religions" rattaché au portfolio "VITRAUX"
 Et le topic "Artiste" attribué au viewpoint "Histoire de l'art"
 Et le topic "Hugot" attribué au topic "Artiste"
 Et le topic "Datation" attribué au viewpoint "Histoire de l'art"
 Et le topic "XIXe s." attribué au topic "Datation"
 Et le topic "XVIe s." attribué au topic "Datation"
 Et le topic "1883" attribué au topic "XIXe s."
 Et le topic "début XVIe" attribué au topic "XVIe s."
 Et le topic "Technique du verre" attribué au viewpoint "Histoire de l'art"
 Et le topic "Grisaille" attribué au topic "Technique du verre"
 Et le topic "Jaune d'argent" attribué au topic "Technique du verre"
 Et le topic "Récits" attribué au viewpoint "Histoire des religions"
 Et le topic "Évangile" attribué au topic "Récits"
 Et le topic "selon Matthieu" attribué au topic "Évangile"
 Et le topic "Origines de Jésus (arbre de Jessé)" attribué au topic "selon Matthieu"

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
