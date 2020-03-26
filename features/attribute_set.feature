#language: fr

Fonctionnalité: Decrire un item avec une categorie

scénario:
  soit un item en cours de modification
  Et le point de vue "test" créé
  Et la catégorie "couleur" créée dans "test"
  Et l'utilisateur Alice connecté
  Quand l'utilisateur indique "couleur" dans le champ d'ajout de rubriques
  du point de vue "test"
  Alors l'item apparaît dans les références de la catégorie "couleur" du point de vue "test"
