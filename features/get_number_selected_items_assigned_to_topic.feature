#language: fr

Fonctionnalité: Pour chaque thème , récupérer le nombre d'items sélectionnés qui lui sont assignés

Scénario: Afficher le nombre d'item contient dans ce thème

 Soit un visiteur ouvre la page d'accueil
 Quand un visiteur sélectionne:
   | selected |
 Alors chaque thème dans tous les points de vue affiche:
   | theme | number |
   | Artiste | 129 |

Scénario: Afficher le nombre d'items pour un thème sélectionné

 Soit un visiteur ouvre la page d'accueil
 Quand un visiteur sélectionne:
   | selected |
   | Albrecht Dürer (d'après) |
 Alors chaque thème dans tous les points de vue affiche:
   | theme | number |
   | Albrecht Dürer (d'après) | 11 |

Scénario: Afficher le nombre d'items pour les thèmes sélectionnés

 Soit un visiteur ouvre la page d'accueil
 Quand un visiteur sélectionne:
   | selected |
   | Albrecht Dürer (d'après) |
   | 1er quart XVIe |
 Alors chaque thème dans tous les points de vue affiche:
   | theme | number |
   | Albrecht Dürer (d'après) | 1 |
   | 1er quart XVIe | 1 |
