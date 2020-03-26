#language: fr

Fonctionnalité: Décrire un item à l’aide d’attributs

Scénario:
  Soit un item en cours de création
  Et l'utilisateur "alice" connecté
  Quand l'utilisateur indique "Musée de Vauluisant, Troyes" comme valeur de l'attribut "spatial"
  Alors la valeur de l'attribut "spatial" est "Musée de Vauluisant, Troyes"

Fonctionnalité: Décrire un item avec un attribut lien
  
Scénario:
  Soit un item en cours de création
  Et l'utilisateur "Florian" connecté
  Quand  l'utilisateur indique "https://www.ulaval.ca/les-etudes/cours/repertoire/detailsCours/glo-1111-pratique-du-genie-logiciel.html" comme valeur de l'attribut "cours_lien"
  Alors la valeur de l'attribut "cours_lien" est "https://www.ulaval.ca/les-etudes/cours/repertoire/detailsCours/glo-1111-pratique-du-genie-logiciel.html"