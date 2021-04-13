#language: fr

Fonctionnalité: À partir d'un item, consulter les items apparentés

Scénario: par leur nom

  Soit "AXN 009" l'item affiché
  Et l'attribut "created" a pour valeur "2017-09-24"
  Et "AXN 009" un des items affichés
  Quand l'utilisateur choisit l'item "AXN 009" dans le bloc Items ayant le même nom
  Alors l'item "AXN 009" est affiché
  Et la valeur de l'attribut "created" est "1907/1914"
  Et l'item "AXN 009" est affiché

Scénario: par une de leurs rubriques

  Soit "SNZ 006" l'item affiché
  Quand on choisit la rubrique "Sacrifice d'Abraham"
  Alors la rubrique "Sacrifice d'Abraham" est sélectionnée
  Et l'item "SJ 001" est affiché
  Et l'item "SM 001 n" est affiché
  Et l'item "SNZ 006" est affiché

Scénario: par un de leurs attributs

  Soit "SNZ 006" l'item affiché
  Quand on choisit l'attribut "Église Saint-Nizier, Troyes"
  Alors l'attribut "spatial : Église Saint-Nizier, Troyes" est sélectionné
  Et l'item "SNZ 005" est affiché
  Et l'item "SNZ 006" est affiché
  Mais l'item "SM 001 n" n'est pas affiché
