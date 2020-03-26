#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"




Fonctionnalité: Decrire un item avec une categorie

scénario:
  soit un item en cours de modification
  Et le point de vue "test" créé
  Et la catégorie "couleur" créée dans "test"
  Et l'utilisateur Alice connecté
  Quand l'utilisateur indique "couleur" dans le champ d'ajout de rubriques
  du point de vue "test"
  Alors l'item apparaît dans les références de la catégorie "couleur" du point de vue "test"
