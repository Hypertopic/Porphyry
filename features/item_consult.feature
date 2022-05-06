#language: fr

Fonctionnalité: Consulter les rubriques et attributs associés à un item sur desktop

Scénario: sur desktop

  Soit "SNZ 006" l'item affiché
  Alors le titre de l'item affiché est "SNZ 006"
  Et la valeur de l'attribut "spatial" est "Église Saint-Nizier, Troyes"
  Et la valeur de l'attribut "created" est "2014-04-05"
  Et une des rubriques de l'item est "Sacrifice d'Abraham"
  Et une des rubriques de l'item est "Isaac"
  Et une des rubriques de l'item est "1er quart XVIe"

Scénario: sur mobile

  Soit "SNZ 006" l'item affiché
  Et l'utilisateur est sur mobile
  Alors le titre de l'item affiché est "SNZ 006"
  Et les attributs ne sont pas affichés
  Et le point de vue "Histoire de l'art" contient la pilule "Vers 1520"
  Et le point de vue "Histoire de l'art" ne contient pas la pilule "1er quart XVIe"
  Et le point de vue "Histoire des religions" contient la pilule "Isaac"
  Et le point de vue "Histoire des religions" ne contient pas la pilule "Personnages"
  Et la légende de l’image est "© Aurélien Bénel, 2014"

Scénario: qui soit une photo en noir et blanc, sur mobile

  Soit "AXN 009 B&W" l'item affiché
  Et l'utilisateur est sur mobile
  Alors le titre de l'item affiché est "AXN 009"
  Et l'attribut "creator" est absent
  Et l'attribut "created" est absent
  Et la légende de l’image est "1907/1914"
