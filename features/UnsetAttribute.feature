#language: fr

Fonctionnalité: Unset an item’s attribute (Supprimer les informations de bases (attribut"*e) d'une personne (item))

Scénario: Unset Attribute
  Soit l'Item "ABT" rattache au portfolio "VITRAUX"
  Soit l'Item "ABT" ayant l'AttributeName "spatial"
  Soit l'AttributeName "spatial" étant avec l'AttributeValue "Arrembécourt"
  Quand l'utilisateur ouvre la page d'accueil
  Et l'utilisateur clique l'Item "ABT"
  Et l'utilisateur clique le bouton "Modifier"
  Et l'utilisateur clique le bouton "X" à côté de l'AttributeName "spatial"
  Alors l'AttributeName "test" est enlevé dans la base de données
