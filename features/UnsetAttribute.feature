#language: fr

Fonctionnalité: Unset an item’s attribute (Supprimer les informations de bases (attribut"*e) d'une personne (item))

Scénario: Unset Attribute
  Soit l'Item "Yann DIJOUX" rattaché au portfolio "Annuaire participatif"
  Soit l'Item "Yann DIJOUX" ayant l'AttributeName "Formation"
  Soit l'AttributeName "Formation" étant avec l'AttributeValue "ISI4 MPL"
  Quand l'utilisateur clique l'Item "Yann DIJOUX"
  Et l'utilisateur clique le bouton "Modifier"
  Et l'utilisateur clique le bouton "Supprimer" à côté de l'AttributeName "Formation"
  Alors l'AttributeName "Formation" est enlevé dans la base de données
