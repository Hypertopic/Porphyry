#language: fr

Fonctionnalité: Pour chaque thème , récupérer le nombre d'items sélectionnés qui lui sont assignés

Scénario: Afficher le nombre d'item contient dans ce thème

 Soit un visiteur ouvre la page d'accueil
 Quand un visiteur "ne sélectionne aucun thème"
 Alors chaque thème dans tous les points de vue affiche "le nombre d'items qu'il contient"

Scénario: Afficher le nombre d'items pour un thème sélectionné

 Soit un visiteur ouvre la page d'accueil
 Quand un visiteur "sélectionne un thème"
 Alors chaque thème dans tous les points de vue affiche "le nombre d'items qu'il contient et qui a une relation avec le thème sélectionné"

Scénario: Afficher le nombre d'items pour les thèmes sélectionnés

 Soit un visiteur ouvre la page d'accueil
 Quand un visiteur "sélectionne plusieurs thèmes"
 Alors chaque thème dans tous les points de vue affiche "le nombre d'items qu'il contient et qui a une relation avec les thèmes sélectionnés"
