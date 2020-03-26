#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Fonctionnalité: Ajouter une ressource à un item (contenant un lien)

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "http://www.cite-vitrail.fr/" comme valeur de l'attribut "link"
  Alors la valeur de l'attribut "link" est "http://www.cite-vitrail.fr/"
