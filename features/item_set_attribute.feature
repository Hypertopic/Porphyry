#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario: ayant pour valeur de courts textes

  Soit un item en cours de création
  Et l'utilisateur est connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Scénario: ayant pour valeur des URI

  Soit un item en cours de création
  Et l'utilisateur est connecté
  Quand l'utilisateur indique "https://www.aube-champagne.com/fr/poi/museo-de-vauluisant/#cdt-information" comme valeur de l'attribut "visite"
  Alors la valeur de l'attribut "visite" est "https://www.aube-champagne.com/fr/poi/museo-de-vauluisant/#cdt-information"
  Et "https://www.aube-champagne.com/fr/poi/museo-de-vauluisant/#cdt-information" mène à une page intitulée "Musée de Vauluisant"
