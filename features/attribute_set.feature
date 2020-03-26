#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Scénario:
     Soit un item en cours de création
     Et l'utilisateur "alice" est connecté
     Quand l'utilisateur indique "IF05" comme valeur de l'attribut "nom"
     Alors la valeur de l'attribut "nom" est "IF05"