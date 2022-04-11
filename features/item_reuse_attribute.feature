#language: fr

Fonctionnalité: Réutiliser un attribut ou une valeur existante

Scénario: En renseignant un attribut et une valeur inexistante

Soit "vitraux" le portfolio ouvert
Et l'utilisateur est connecté
Et l'utilisateur est sur la page d'édition de l'item "SR 005"
Quand l'utilisateur renseigne l'attribut "spatial" préexistant avec une nouvelle valeur "Musée de Vauluisant, Troyes" en recherchant "spat"
Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Scénario:  En renseignant un attribut et une valeur existants

Soit "vitraux" le portfolio ouvert
Et l'utilisateur est connecté
Et l'utilisateur est sur la page d'édition de l'item "SR 005"
Quand l'utilisateur renseigne l'attribut "spatial" préexistant avec la valeur "Église Sainte-Madeleine, Troyes" proposée parmi les valeurs existantes en recherchant "spat" et "sainte-madeleine"
Alors la valeur de l'attribut "spatial" est "Église Sainte-Madeleine, Troyes"