#language: fr

Fonctionnalité: Editer les catégories

Contexte:
Soit l`utilisateur dans la page de modification du point de vue "Histoire de l'art"

Scénario: Créer une catégorie fille

Quand l`utilisateur clique le bouton d'ajout à côté du point de vue "Histoire de l\'art"
Et l`utilisateur entre "Une certaine catégorie fille" dans le champ de texte apparait sous "Histoire de l\'art" et tappe Entrée
Alors la catégorie "Une certaine catégorie fille" apparait sous le point de vue "Histoire de l\'art"

Scénario: Créer une soeur d'une catégorie

Soit la catégorie "Une certaine catégorie petite-fille" sous la catégorie "Une certaine catégorie fille"
Quand l`utilisateur clique le bouton d'ajout à côté de la catégorie "Une certaine catégorie fille"
Et l`utilisateur entre "La deuxième catégorie petite-fille" dans le champ de texte apparait sous "Histoire de l\'art" et tappe Entrée
Alors la catégorie "La deuxième catégorie petite-fille" est de même niveau de la catégorie "Une certaine catégorie petite-fille" sous la catégorie "Une certaine catégorie fille"

Scénario: Renommer une catégorie

Quand l`utilisateur clique le bouton de modification à côté de la catégorie "Une certaine catégorie fille"
Et l`utilisateur change le nom de la catégorie "Une certaine catégorie fille" en "La fille de l'art" et tappe Entrée
Alors la catégorie "Une certaine catégorie fille" n'est plus affichée
Et la catégorie "La fille de l'art" est affiché

Scénario: Supprimer une catégorie

Quand l`utilisateur clique le bouton de suppression à côté de la catégorie "La fille de l'art"
Alors la catégorie "La fille de l'art" n'est plus affichée
Et la catégorie "La deuxième catégorie petite-fille" n'est plus affichée
Et la catégorie "Une certaine catégorie petite-fille" n'est plus affichée