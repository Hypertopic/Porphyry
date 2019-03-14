#language: fr

Fonctionnalité: Renommer une catégorie

Contexte:
  Soit la page "Modification du point de vue" rattaché au point de vue "Histoire de l'art"
  Soit la catégorie "Datation" rattaché au point de vue "Histoire de l'art"

Scénario: Renommer la catégorie "Artiste" en "Artistes"
  Soit "Modification du point de vue" la page ouverte
  Et l'utilisateur est connecté avec le mot de passe
  Et le point de vue "Histoire de l'art" est développé
  Quand la catégorie "Datation" est modifiée en "Datage"
  Alors la catégorie "Datation" n'est plus affiché
  Et la catégorie "Datage" est affiché
