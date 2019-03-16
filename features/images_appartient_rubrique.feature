#language: fr

Fonctionnalité: Vérifier toutes les images appartiennent bien à une rubrique 

Contexte:
	Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
	Soit le corpus "Vitraux - Bénel" rattaché au portfolio "vitraux"
	Soit le corpus "Vitraux - Recensement" rattaché au portfolio "vitraux"
	
	Soit la rubrique "Artiste" rattachée au point de vue "Histoire de l'art"
	Soit la rubrique "Édouard-Amédée Didron" contenue dans la rubrique "Artiste"
	Soit la rubrique "Hugot" contenue dans la rubrique "Artiste"
	
Scénario: quand la rubrique ne contient pas d'élement
	Soit la rubrique "Artiste" sélectionnée et dévellopée 
	Quand la rubrique "Hugot" est sélectionnée
	Alors l'emplacement des items est vide
	
Scénario: quand la rubrique contient des élements	
	Soit la rubrique "Artiste" sélectionnée et dévellopée 
	Quand la rubrique "Édouard-Amédée Didron" est sélectionnée
	Alors tous les items sont affichés et doivent appartenir à la rubrique "Édouard-Amédée Didron"