#language: fr

Fonctionnalité: Ajouter une rubrique à la sélection actuelle

Contexte:
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"

 Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
 Soit le corpus "Vitraux - Recensement" rattaché au portfolio "vitraux"

 Soit la rubrique "Ateliers du Carmel du Mans" rattachée au point de vue "Histoire de l'art"
 Soit la rubrique "1868" rattachée au point de vue "Histoire de l'art"
 Soit la rubrique "David Tremlett" rattachée au point de vue "Histoire de l'art"

 Soit l'item "DSN 001" rattaché à la rubrique "Ateliers du Carmel du Mans"
 Soit l'item "DSN 001" rattaché à la rubrique "1868"
 Soit l'item "DSN 003" rattaché à la rubrique "Atelier du Carmel du Mans"
 Soit l'item "Villenauxe-la-Grande" rattaché à la rubrique "David Tremlett"

Scénario: quand elle est vide
 Soit la liste des rubriques sélectionnées est vide
 Et "Artiste" une des rubriques développées
 Quand on sélectionne la rubrique "Ateliers du Carmel du Mans"
 Alors les rubriques surlignées sont au nombre de 1
 Et l'item "DSN 001" est affiché
 Et l'item "DSN 003" est affiché
 Et l'item "Villenauxe-la-Grande" n'est pas affiché

Scénario: quand elle est non vide
 Soit les rubriques "Ateliers du Carmel du Mans" sont sélectionnées
 Et "Artiste" une des rubriques développées
 Et "Datation" une des rubriques développées
 Et "XIXe s." une des rubriques développées
 Quand on sélectionne la rubrique "1868"
 Alors les rubriques surlignées sont au nombre de 2
 Et l'item "DSN 001" est affiché
 Et l'item "DSN 003" n'est pas affiché
 Et l'item "Villenauxe-la-Grande" n'est pas affiché
