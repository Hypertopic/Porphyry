#language: fr

Fonctionnalité: Unset an item’s attribute (Supprimer les informations de bases (attribut"*e) d'une personne (item))

Contexte:
  Soit l'utilisateur ayant un Item lui correspondant au portfolio "Annuaire participatif"
  Soit l'Attribute de son Item comprenant l'AttributeName "Formation" et l'AttributeName "Nom"
  Soit l'AttributeName "Formation" étant avec l'AttributeValue "ISI4 MPL"
  Soit l'AttributeName "Nom" étant avec l'AttributeValue "DIJOUX"

Scénario: Unset an optional Attribute
  Soit l'utilisateur étant sur la page de modification de profil
  Quand il clique le bouton "Supprimer" à côté de l'AttributeName "Formation"
  Alors l'AttributeName "Formation" est enlevé depuis l'ensemble de l'Attribut d'Item correspont au utilisateur dans la base de données
  Et sur la page actuelle, il n'y a plus l'AttributeName "Formation"

Scénario: Unset a compulsory Attribute
  Soit l'utilisateur étant sur la page de modification de profil
  Quand il clique le bouton "Supprimer" à côté de l'AttributeName "Nom"
  Alors un message disant que la modification n'est pas faite car l'AttributeName "Nom" est obligatoire dans l'Attribut d'un Item s'affiche
