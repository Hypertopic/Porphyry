#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Issue:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand  l'utilisateur indique "https://www.ecosia.org/search?q=google" comme valeur de
  l'attribut "link"
  Alors la valeur de l'attribut "link" est "https://www.ecosia.org/search?q=google"