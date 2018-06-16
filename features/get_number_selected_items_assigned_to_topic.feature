#language: fr

Fonctionnalité: Pour chaque rubrique, récupérer le nombre d'items sélectionnés qui lui sont assignés

Contexte:

    Soit la rubrique "Ateliers du Carmel du Mans" contenue dans la rubrique "Artiste"
    Et la rubrique "XIXe s." contenue dans la rubrique "Datation"
    Et 21 items décrits par "Ateliers du Carmel du Mans" et "XIXe s."

Scénario: quand aucune rubrique n'est sélectionnée

    Soit "vitraux" le portfolio ouvert
    Alors il doit y avoir au moins 18 items sélectionnés décrits par "Artiste"
    Et il doit y avoir au moins 18 items sélectionnés décrits par "Datation"

Scénario: quand une rubrique est sélectionnée

    Soit "vitraux" le portfolio ouvert
    Et "Artiste" une des rubriques développées
    Et "Datation" une des rubriques développées
    Quand on sélectionne la rubrique "Ateliers du Carmel du Mans"
    Alors il doit y avoir au moins 18 items sélectionnés décrits par "Ateliers du Carmel du Mans"
    Et il doit y avoir au moins 18 items sélectionnés décrits par "XIXe s."
