#language: fr

Fonctionnalité: Enlever un thème de la sélection actuelle

Contexte:
Soit un visiteur ouvre la page d'accueil du site
Soit le thème "Ateliers du Carmel du Mans" est choisi
Soit le thème "XIXe s." est choisi
Soit le thème "1862" est choisi
Soit "DSN 006" est affiché
Soit "DSN 001" n'est pas affiché

Scénario: Spécifier l'année
Quand le thème "XIXe s." est désélectionné
Alors le sous-titre est "Ateliers du Carmel du Mans + 1862"
#   Et le nombre d'items affichés dans le vitrine est 8
Et la vitrine contient "DSN 006"
Et la vitrine ne contient pas "DSN 001"

Scénario: Spécifier l'époque
Quand le thème "1862" est désélectionné
Alors le sous-titre est "Ateliers du Carmel du Mans + XIXe s."
# Et le nombre d'items affichés dans le vitrine est 21
Et la vitrine contient "DSN 001"
Et la vitrine contient "DSN 006"