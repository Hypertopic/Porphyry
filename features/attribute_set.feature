#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario: ayant pour valeur de courts textes

  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Scénario: ayant pour valeur des URI

  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "https://www.aube-champagne.com/fr/poi/hotel-de-vauluisant-musee-de-vauluisant/#cdt-information" comme valeur de l'attribut "visite"
  Alors la valeur de l'attribut "visite" est "https://www.aube-champagne.com/fr/poi/hotel-de-vauluisant-musee-de-vauluisant/#cdt-information"
