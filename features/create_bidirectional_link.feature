#language: fr

Fonctionnalité : Avoir un lien bidirectionnel entre les items

Scénario : L’utilisateur souhaite visualiser les prérequis d’une UE

  Soit “NF05” l’item affiché
  Alors une des rubriques de l’item est “Prérequis”
  Et la page contient “NF04”
  Quand l’utilisateur clique sur “NF04”
  Alors “NF04” l’item affiché

Scénario : L’utilisateur souhaite visualiser les approfondissements d’une UE

  Soit “NF04” l’item affiché
  Alors une des rubriques de l’item est “Approfondissements”
  Et la page contient “NF05”
  Quand l’utilisateur clique sur “NF05”
  Alors “NF05” l’item affiché
  