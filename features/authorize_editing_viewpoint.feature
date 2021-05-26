#language: fr

Fonctionnalité: Autoriser un contributeur de points de vue à éditer un point de vue

Scénario: L’utilisateur est contributeur de points de vue

Soit l’utilisateur est connecté 
Et l’utilisateur est contributeur de points de vue
Alors le bouton "Modifier un point de vue" est visible 
Et le bouton “Modifier un point de vue personnel ” est visible 
Quand l’utilisateur clique sur "Modifier un point de vue"
Alors le menu de modification des points de vue s’affiche
Quand l’utilisateur clique sur "Modifier un point de vue personnel"
Alors le menu de modification des points de vue s’affiche

Scénario: L’utilisateur n’est pas contributeur de points de vue

Soit l’utilisateur est connecté
Et l’utilisateur n’est pas contributeur de points de vue
Alors le bouton "Modifier un point de vue" est invisible 
Alors le bouton “Modifier un point de vue personnel ” est visible 
Quand l’utilisateur clique sur "Modifier un point de vue personnel"
Alors le menu de modification des points de vue s’affiche

Scénario: L’utilisateur n’est pas connecté 

Soit l’utilisateur n’est pas connecté 
Alors le bouton "Modifier un point de vue" est invisible
Alors le bouton "Modifier un point de vue personnel" est invisible










