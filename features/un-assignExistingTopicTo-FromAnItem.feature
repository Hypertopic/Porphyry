#language: fr

Fonctionnalité: (Dés)Assigner un topic existant d'/à un item

Contexte:
    Soit le point de vue "Histoire de l'art" rattaché au portfolio "Vitraux"

Scénario: Assigner un topic existant à un item sélectionné
    Soit "CHP" l'item affiché
    Quand le visiteur veut attribuer le topic "XXIe s." au point de vue "Histoire de l'art"
    Alors la page affiche les différents topics, dont "XXIe s."
    Et le visiteur choisit le topic "XXIe s." du point de vue "Histoire de l'art"
    Et l'item "CHP" possède désormais le topic "XXIe s."

Scénario: Désassigner un topic existant d'un item sélectionné
    Soit "CHP" l'item affiché
    Quand le visiteur veut enlever le topic "XXIe s." de l'item "CHP"
    Alors le visiteur supprime le topic "XXIe s."
    Et l'item "CHP" ne possède désormais plus le topic "XXIe s."