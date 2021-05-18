#language: fr

Fonctionnalité : Autoriser un contributeur à éditer un point de vue

Scénario : L’utilisateur est contributeur 

Soit l’utilisateur est connecté 
Et l’utilisateur est contributeur
Alors le bouton “Modifier point de vue” est visible 
Quand l’utilisateur clique sur “Modifier un point de vue”
Alors le menu de modification des points de vue s’affiche

Scénario : L’utilisateur n’est pas contributeur 

Soit l’utilisateur est connecté
Et l’utilisateur n’est pas contributeur
Alors le bouton “Modifier un point de vue “ est invisible 

Scénario : L’utilisateur n’est pas connecté 

Soit l’utilisateur n’est pas connecté 
Alors le bouton “Modifier un point de vue “ est invisible






