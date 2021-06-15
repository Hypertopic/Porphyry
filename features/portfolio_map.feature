#language: fr

Fonctionnalité: Voir les items placés sur la carte pour toute localisation

Scénario: connue de Google Maps
    Soit "AXN 009" l'item à afficher sur la carte
    Et le titre de l'item affiché est "AXN 009"
    Et la valeur de l'attribut "spatial" est "Église Saint-Loup, Auxon"
    Alors la valeur de la latitude est "48.10349009999999"
    Et la valeur de la longitude est "3.9183057"

Scénario: connue seulement de GeoXEne
    Soit "SAA B" l'item à afficher sur la carte
    Et le titre de l'item affiché est "SAA B"
    Et la valeur de l'attribut "spatial" est "Société académique de l'Aube, Troyes"
    Alors la valeur de la latitude est "48.30125604190763"
    Et la valeur de la longitude est  "4.080524344621788"

Scénario: avec tout calque sélectionné
    Soit "vases" le portfolio ouvert
    Et l'attribut "uri" du calque "0" est "https://steatite.utt.fr/picture/405e66c63060b595c02e6590a8f6abbda104cb03"
    Et l'attribut "south" du calque "0" est "37.977910"
    Et l'attribut "west" du calque "0" est "23.718200"
    Et l'attribut "north" du calque "0" est "37.978780"
    Et l'attribut "east" du calque "0" est "23.719010"
    Quand on zoome sur "Kerameikos, Athènes, Grèce" dans la carte
    Alors le calque "0" est affiché sur la carte
