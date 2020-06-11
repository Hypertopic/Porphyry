#language: fr

Scénario: Consulter le portfolio en langue préférée

Soit la langue du navigateur est "fr"
Et "vitraux" le portfolio ouvert
Alors la page contient "Points de vue"
Et la page contient "Nouveau point de vue"
Et la page contient "Tous les items"

Scénario: Consulter le portfolio en langue souhaitée

Soit la langue du navigateur est "de,en,fr"
Et "vitraux" le portfolio ouvert
Alors la page contient "Viewpoints"
Et la page contient "New viewpoint"
Et la page contient "All items"

Scénario: Consulter le portfolio en une autre langue

Soit la langue du navigateur est "de"
Et "vitraux" le portfolio ouvert
Alors la page contient "Viewpoints"
Et la page contient "New viewpoint"
Et la page contient "All items"
