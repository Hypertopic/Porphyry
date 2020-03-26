#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Fonctionnalité: Ajouter un lien à une ressource

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "http://medias.tourism-system.fr/9/e/120327_vauluisantpeintures.jpg" comme valeur de l'attribut "link"
  Alors la valeur de l'attribut "link" est "http://medias.tourism-system.fr/9/e/120327_vauluisantpeintures.jpg"
