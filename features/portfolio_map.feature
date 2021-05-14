#language: fr

Fonctionnalité: Affichage de calques
	Scénario: Voir un calque sur la carte
		Soit "Calque 1" le calque sélectionné
		Alors le calque "Calque 1" est affiché sur la carte

	Scénario: Voir plusieurs calques sur la carte
		Soit "Calque 1|Calque 2" les calques sélectionnés
		Alors le calque "Calque 1" est affiché sur la carte
		Et le calque "Calque 2" est affiché sur la carte

