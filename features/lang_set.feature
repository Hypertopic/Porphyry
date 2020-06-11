#language: fr

Fonctionnalité: Utiliser le logiciel

Scénario: dans sa langue maternelle

Soit la langue du navigateur est "fr"
Et "vitraux" le portfolio ouvert
Alors la page contient "Points de vue"
Et la page contient "Nouveau point de vue"
Et la page contient "Tous les items"

Scénario: dans une langue que l'on comprend

Soit la langue du navigateur est "de,en,fr"
Et "vitraux" le portfolio ouvert
Alors la page contient "Viewpoints"
Et la page contient "New viewpoint"
Et la page contient "All items"

Scénario: dans la langue par défaut

Soit la langue du navigateur est "de"
Et "vitraux" le portfolio ouvert
Alors la page contient "Viewpoints"
Et la page contient "New viewpoint"
Et la page contient "All items"
