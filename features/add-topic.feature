#language: fr

Fonctionnalité: Ajouter un thème à la sélection actuelle

Contexte:
Soit un visiteur ouvre la page d'accueil du site
Soit le thème "Ateliers du Carmel du Mans" est choisi
Soit "DSN 001" est affiché
Soit "DSN 006" est affiché

Scénario: Sélectionner l'époque d'items
Quand le thème "XIXe s." est sélectionné
Alors le sous-titre est "Ateliers du Carmel du Mans + XIXe s."
# Et le nombre d'items affichés dans le vitrine est 21
Et la vitrine contient "DSN 001"
Et la vitrine contient "DSN 006"

Scénario: Filtrer la sélection en ajoutant le temps spécifique
Quand le thème "1862" est sélectionné
Alors le sous-titre est "Ateliers du Carmel du Mans + 1862"
#  Et le nombre d'items affichés dans le vitrine est 8
Et la vitrine contient "DSN 006"
Et la vitrine ne contient pas "DSN 001"