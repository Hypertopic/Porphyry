#language: fr

Fonctionnalité: Set an item's attributs

Contexte:

  Soit l'item "ABT" spécifié dans la configuration

Scénario: Créer un nouvel attribut

  Soit le bouton "Créer" rattaché au point de vue "Attributs du document"
  Quand un visiteur clique sur le bouton "Créer"
  Alors un champ de nom de l'attribut appelé "key" est affiché
  Et un champ de valeur de l'attribut appelé "value" est affiché

Scénario: Enregistrer le nouvel attribut

  Soit le bouton "Créer" cliqué
  Quand un visiteur saisit "address" dans le champ de nom de l'attribut
  Et il saisit "UTT" dans le champ de valeur de l'attribut
  Et il clique sur le bouton "Valider"
  Alors un nouvel attibut "address" applé "UTT" est enregistré
