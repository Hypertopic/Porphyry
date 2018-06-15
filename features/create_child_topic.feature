#language: fr

Fonctionnalité: Créer des enfants

Contexte:
Soit l`utilisateur dans la page de modification du point de vue "Histoire de l'art"

Scénario: Créer l'enfant d'un point de vue
Quand l`utilisateur crée la catégorie "Histoire de l\'art fille" sous le point de vue "Histoire de l\'art"
Alors la catégorie "Histoire de l\'art fille" apparait dans l`arborescence directement sous "Histoire de l\'art"

Scénario: Créer une fille d'une catégorie
Quand l`utilisateur crée la catégorie "Histoire de l\'art petite fille" sous "Histoire de l\'art fille"
Alors la catégorie "Histoire de l\'art petite fille" apparait dans l`arborescence directement sous "Histoire de l\'art fille"

Scénario: Faire de ménage
Quand l`utilisateur finit ce test
Alors la page supprime "Histoire de l'art fille"
# la petite fille est incluse dans la fille
# alors elle sera supprimée en même temps avec la fille