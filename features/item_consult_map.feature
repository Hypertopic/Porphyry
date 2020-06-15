#language: fr

Fonctionnalité: Consulter des items sur une carte statique

Scénario:

Soit "Abram/Abraham" les rubriques sélectionnées
Et "SM 001 n" l'item affiché
Et "SJ 001" l'item affiché
Et la carte est affichée
Et les marqueurs indiquant les lieux "Église Sainte-Madeleine, Troyes" et "Église Saint-Jean-au-Marché, Troyes" sont affichés
Quand on choisit la rubrique "Artiste"
Alors la carte est affichée
Et l'item "SM 001 n" est affiché
Et l'item "SJ 001" n'est pas affiché
Et la carte indique le lieu "Église Sainte-Madeleine, Troyes"
Et la carte n'indique plus le lieu "Église Saint-Jean-au-Marché, Troyes"
