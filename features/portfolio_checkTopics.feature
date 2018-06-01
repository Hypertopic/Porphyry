#language: fr

Fonctionnalité: Vérifier les topics qui sont sélectionés

Contexte:
Soit le visiteur consulte le portfolio "vitraux"
Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"

Scénario: Vérifier les topics qui sont sélectionés avec aucune sélection
Quand un visiteur ne possède pas de catégorie sélectionnée
Alors tous les items du corpus sont visibles

Scénario: Vérifier les topics qui sont sélectionés avec une sélection
Quand un visiteur a sélectionné la catégorie "Artiste"
Alors la catégorie "Artiste" est surlignée

Scénario: Vérifier les topics qui sont sélectionés avec deux sélections
Quand un visiteur a sélectionné la catégorie "Artiste" et "Datation"
Alors la catégorie "Artiste" et "Datation" sont surlignées
