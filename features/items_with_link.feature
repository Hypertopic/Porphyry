#language: fr

Fonctionnalité : Créer un lien bidirectionnel entre deux items

Scénario : À partir d'un item, obtenir ceux qui sont similaires
  Soit "SNZ 006" l'item affiché
  Et la liste des items similaires "SM 008" est visible
  Quand l’utilisateur choisit l’item "SM 008" dans la liste des items similaires
  Alors "SM 008" est l'item affiché
  Et l'item "SNZ 006" est visible dans la liste des items similaires


Scénario : Ajouter un item similaire à un autre item
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l’utilisateur indique "SM 008" comme item similaire
  Alors l’item "SM 008" est visible dans la liste des items similaires
