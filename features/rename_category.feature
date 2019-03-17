#language: fr

Fonctionnalité: Renommer une catégorie

Contexte:
 Soit la page "Modification du point de vue" rattachée au point de vue "Histoire de l'art"
 Soit la page "Modification du point de vue" ouverte
 Soit le point de vue "Histoire de l'art" développé

Scénario:
 Soit l'utilisateur "alice" connecté
 Quand la catégorie "Artiste" est modifiée en "Artistes"
 Alors la catégorie "Artiste" est supprimée
 Et la catégorie "Artistes" est ajoutée
