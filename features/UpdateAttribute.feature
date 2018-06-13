#language: fr

Fonctionnalité: Update an item’s attribute (Modifier les informations de bases (attribute) d'une personne (item))

Contexte:
  Soit l'utilisateur ayant un Item lui correspondant au portfolio "Annuaire participatif"
  Soit l'Attribute de son Item comprenant l'AttributeName "Formation"
  Soit l'AttributeName "Formation" étant avec l'AttributeValue "ISI4 MPL"

Scénario: Update an item's Attribute
  Soit l'utilisateur étant sur la page de modification de profil
  Quand il modifie l'AttributeName "Formation" avec l'AttributeValue "ISI5 MPL"
  Et il clique sur le bouton "Enregistrer"
  Alors l'AttributeValue de l'AttributeName "Formation" change de "ISI4 MPL" à "ISI5 MPL" dans la base de données
  Et un message disant que la modification est bien enregistrée affiche
  Et sur la page profil de cet utilisateur l'AttributeName "Formation" est avec l'AttributeValue "ISI5 MPL"
