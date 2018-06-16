#language: fr

Fonctionnalité: Update an item’s attribute (Modifier les informations de bases (attribute) d'une personne (item))

Contexte:
  Soit l'utilisateur ayant un Item lui correspondant au portfolio "Annuaire participatif"
  Soit l'Item "ABT" comprenant l'AttributeName "address"
  Soit l'AttributeName "address" étant avec l'AttributeValue "UTT"

Scénario: Update an item's Attribute
  Quand l'utilisateur ouvre la page d'accueil
  Et l'utilisateur clique l'Item "ABT"
  Et l'utilisateur clique le bouton "Modifier"
  Quand il modifie l'AttributeName "adresse" avec l'AttributeValue "at UTT"
  Et il clique sur le bouton "change"
  Alors la valeur de l'AttributeName "address" change de "UTT" à "at UTT" dans la base de données
  Et sur la page profil de cet utilisateur l'AttributeName "address" est avec l'AttributeValue "at UTT"
