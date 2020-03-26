#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Fonctionnalité: Ajouter une ressource à un item avec un lien
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "http://steatite.hypertopic.org/picture/dfe00d8942620b28257eee774c7e0e49c52a5f8a" comme valeur de l'attribut "link"
  Alors la valeur de l'attribut "link"  est "http://steatite.hypertopic.org/picture/dfe00d8942620b28257eee774c7e0e49c52a5f8a"
