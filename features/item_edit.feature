#language: fr
#Timothée BAYART
#Taher KAMOUN

Fonctionnalité: Décrire un item à l'aide d'attributs

Contexte:

    Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
    Et l'item "SU 006" existant
    Et l'attribut "license" n'existant pas dans la liste des attributs de l'item "SU 006"
    Et l'utilisateur "Alice" connecté avec le mot de passe "whiterabbit"

Scénario:

    Soit "vitraux" le portfolio ouvert
    Et "SU 006" l'item affiché
    Quand on ajoute un attribut "license" et la valeur "CC-BY"
    Alors la valeur de l'attribut "license" est "CC-BY"
