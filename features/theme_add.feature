#language: fr

Fonctionnalité: Ajouter un thème à la sélection actuelle

Contexte:
 Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
 Soit le point de vue "Histoire des religions" rattaché au portfolio "vitraux"

 Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
 Soit le corpus "Vitraux - Recensement" rattaché au portfolio "vitraux"

 Soit le thème "Ateliers du Carmel du Mans" rattaché au point de vue "Histoire de l'art"
 Soit le thème "1868" rattaché au point de vue "Histoire de l'art"
 Soit le thème "David Tremlett" rattaché au point de vue "Histoire de l'art"

 Soit l'item "DSN 001" rattaché au thème "Ateliers du Carmel du Mans"
 Soit l'item "DSN 001" rattaché au thème "1868"
 Soit l'item "DSN 003" rattaché au thème "Atelier du Carmel du Mans"
 Soit l'item "Villenauxe-la-Grande" rattaché au thème "David Tremlett"

Scénario: Ajouter un thème à une sélection vide
 Soit la liste des thèmes sélectionnés est vide
 Quand un visiteur clique sur le thème "Ateliers du Carmel du Mans"
 Alors les thèmes "Ateliers du Carmel du Mans" sont surlignés
 Et l'item "DSN 001" est affiché
 Et l'item "DSN 003" est affiché
 Et l'item "Villenauxe-la-Grande" n'est pas affiché

Scénario: Ajouter un thème à une sélection non vide
 Soit les thèmes "Ateliers du Carmel du Mans" sont sélectionnés
 Quand un visiteur clique sur le thème "1868"
 Alors les thèmes "Ateliers du Carmel du Mans|1868" sont surlignés
 Et l'item "DSN 001" est affiché
 Et l'item "DSN 003" n'est pas affiché
 Et l'item "Villenauxe-la-Grande" n'est pas affiché
