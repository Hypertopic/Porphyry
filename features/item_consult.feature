#language: fr

Fonctionnalité: Consulter les rubriques et attributs associés à un item

Scénario:

  Soit "SNZ 006" l'item affiché
  Alors le titre de l'item affiché est "SNZ 006"
  Et la valeur de l'attribut "spatial" est "Église Saint-Nizier, Troyes"
  Et la valeur de l'attribut "created" est "2014-04-05"
  Et une des rubriques de l'item est "Sacrifice d'Abraham"
  Et une des rubriques de l'item est "Isaac"
  Et une des rubriques de l'item est "1er quart XVIe"

Scénario: l’utilisateur sélectionne un item sur un point de vue sur mobile

  Soit "SJ 000" l'item affiché
  Et l'utilisateur est sur mobile
  Alors le titre de l'item affiché est "SJ 000"
  Et la valeur de l'attribut "spatial" est "Église Saint-Jean-au-Marché, Troyes"
  Et l'attribut "creator" est absent
  Et l'attribut "created" est absent
  Et la légende de l’image est "© Aurélien Bénel, 2016"

Scénario: l’utilisateur sélectionne une photo en noir et blanc sur un point de vue sur mobile

  Soit "AXN 009 B&W" l'item affiché
  Et l'utilisateur est sur mobile
  Alors le titre de l'item affiché est "AXN 009"
  Et la valeur de l'attribut "spatial" est "Église Saint-Loup, Auxon"
  Et l'attribut "creator" est absent
  Et l'attribut "created" est absent
  Et la légende de l’image est "1907/1914"
