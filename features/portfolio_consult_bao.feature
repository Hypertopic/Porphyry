#language: fr

Fonctionnalité: Vérifier les topics qui sont sélectionnés

Contexte:
  Soit la page d'accueil chargée

Scénario: Vérifier un topic qui est sélectionné

  Soit le topic "Artiste" présent sur la page
  Quand un utilisateur clique sur le topic "Artiste"
  Alors le topic "Artiste" a class Selected

Scénario: Vérifier deux topic qui sont sélectionnés

  Soit le topic "Artiste" et "Datation" présentent sur la page
  Quand un utilisateur clique sur deux topic "Artiste" et "Datation"
  Alors le number class Selected est 2