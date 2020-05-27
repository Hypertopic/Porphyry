#language: fr

Fonctionnalité: A partir d'un item, obtenir ceux qui ont une même valeur d'attribut

Scénario:

  Soit "SNZ 006" l'item affiché
  Quand on choisit l'attribut "Église Saint-Nizier, Troyes"
  Alors l'attribut "spatial : Église Saint-Nizier, Troyes" est sélectionné
  Et l'item "SNZ 005" est affiché
  Et l'item "SNZ 006" est affiché
  Et l'item "SM 001 n" n'est pas affiché
