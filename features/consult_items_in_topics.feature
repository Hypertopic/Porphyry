#language: fr

Fonctionnalité: Consulter des items qui correspondent aux thèmes sélectionnés

Contexte:
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"
 Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
 Soit le corpus "Vitraux - Recensement" rattaché au portfolio "vitraux"

 Soit le thème "XIXe s." qui est attaché au point de vue "Histoire de l'art"
 Soit le thème "XVIIe s" qui est attaché au point de vue "Histoire de l'art"

 Soit le item "BSS 002" qui est attaché au thème "XIXe s."
 Soit le item "BSS 002" qui n'est pas attaché au thème "XVIIe s."

 Soit le item "DSN 011" qui est attaché au thème "XIXe s."
 Soit le item "DSN 011" qui est attaché au thème "XVIIe s."

 Soit le item "SP 110" qui n'est pas attaché au thème "XIXe s."
 Soit le item "SP 110" qui est attaché au thème "XVIIe s."

Scénario: Consulter les items qui correspondent à un thème sélectionné

  Soit "vitraux" le portfolio spécifié dans la configuration
  Quand un visiteur ouvre la page d'accueil du site
  Et un visiteur sélectionne le thème "XIXe s."
  Alors le item "BSS 002" est affiché
  Et le item "DSN 011" est affiché
  Et le item "SP 110" n'est pas affiché

Scénario: Consulter les items qui correspondent à plusieurs thème sélectionnés

  Soit "vitraux" le portfolio spécifié dans la configuration
  Quand un visiteur ouvre la page d'accueil du site
  Et un visiteur sélectionne le thème "XIXe s."
  Et un visiteur sélectionne le thème "XVIIe s."
  Alors le item "DSN 011" est affiché
  Et le item "BSS 002" n'est pas affiché
  Et le item "SJ 000" n'est pas affiché
