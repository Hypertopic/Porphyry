#language: fr

Fonctionnalité: Commenter un item

Scénario: avec un texte incluant des citations et des références

  Soit un item en cours de consultation
  Et on est connecté à Disqus
  Quand on ajoute en commentaire :
    """
    Martin, obligé de servir comme militaire, donne à un pauvre la moitié de son manteau :

    > Un jour d'hiver, passant à la porte d'Amiens, [Martin] rencontra un homme nu qui n'avait reçu l'aumône de personne. Martin comprit que ce pauvre lui avait été réservé : il prit son épée, et partagea en deux le manteau qu'il avait sur lui, en donna une moitié au pauvre, et se recouvrit de l'autre moitié qui lui restait. ([Légende dorée](http://livres-mystiques.com/partieTEXTES/voragine/tome03/167.htm))
    """
  Alors un commentaire de l'item contient une citation commençant par "Un jour d'hiver"
  Et un commentaire de l'item contient un lien intitulé "Légende dorée"
