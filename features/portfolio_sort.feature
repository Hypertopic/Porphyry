#language: fr

Fonctionnalité: Trier les items du portfolio

Scénario: Par la valeur de l'attribut spatial

Soit "XIXe s." les rubriques sélectionnées
Et la liste d'items est affichée dans cet ordre là
  |SM 001 m|
  |SM 001 n|
  |SR 005|
Quand l'utilisateur trie les items par la valeur de l'attribut "spatial"
Alors la liste d'items est affichée dans cet ordre
  |SR 005|
  |SM 001 m|
  |SM 001 n|
