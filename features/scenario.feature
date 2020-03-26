#language: fr

 Fonctionnalité: Décrire un item à l’aide d'un attribut de type HTTP-URI

 Scénario:
   Soit un item en cours de création
   Et l'utilisateur "alice" connecté
   Quand l'utilisateur indique "https://www.pinterest.fr/mllemouns/dessin-enfant/" comme valeur de l'attribut "source"
   Alors la valeur de l'attribut "source" est "https://www.pinterest.fr/mllemouns/dessin-enfant/"
   Et l'attribut "https://www.pinterest.fr/mllemouns/dessin-enfant/" est cliquable
