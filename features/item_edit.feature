#language: fr
#Louis VAUCHEZ
#Maximilien REGNIER

Fonctionnalité: Décrire un item à l'aide d'attributs

Contexte:

    Soit le point de vue "Histoire de l'art" rattaché au portfolio "vitraux"
    Et l'item "SU 006" existant
    Et l'attribut "createdBy" n'existant pas dans la liste des attributs de l'item "SU 006"

Scénario:

    Soit "vitraux" le portfolio ouvert
    Et "SU 006" l'item affiché
    Quand on ajoute un attribut "createdBy" et la valeur "Louis VAUCHEZ"
    Alors la valeur de l'attribut "createdBy" est "Louis VAUCHEZ"
