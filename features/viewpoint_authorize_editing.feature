#language: fr

Fonctionnalité: Autoriser ou non un utilisateur à éditer un point de vue

Scénario: L'utilisateur est noté sur la liste d'édition du point de vue

   Soit "eut-skills" le portfolio ouvert
   Et l'utilisateur "alice" est connecté
   Et l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Informatique"
   Quand l'utilisateur "alice" modifie l'appellation du point de vue "Informatique" par "Matériaux"
   Alors l'appellation du point de vue est "Matériaux"

Scénario: Le contributeur est l'auteur d'un point de vue

   Soit l'utilisateur "alice" est l'auteur du point de vue "Industrie"
   Alors l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Industrie"

Scénario: La liste d'édition du point de vue n'est pas définie

   Soit "eut-skills" le portfolio ouvert
   Et l'utilisateur "alice" est connecté
   Et la liste d'édition du point de vue "Chimie" n'existe pas
   Quand l'utilisateur "alice" modifie l'appellation du point de vue "Chimie" par "Physique"
   Alors l'appellation du point de vue est "Physique"

Scénario: L'utilisateur n'est pas noté sur la liste d'édition du point de vue

   Soit "eut-skills" le portfolio ouvert  
   Et l'utilisateur "alice" est connecté
   Et l'utilisateur "alice" n'est pas noté sur la liste d'édition du point de vue "Mécanique"
   Quand l'utilisateur "alice" modifie l'appellation du point de vue "Mécanique" par "Informatique"
   Alors l'appellation du point de vue est "Mécanique"

Scénario: L'utilisateur ajoute un contributeur à la liste d'édition

   Soit "eut-skills" le portfolio ouvert
   Et l'utilisateur "alice" est connecté
   Et l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Informatique"
   Et l'utilisateur "alcarazc" n'est pas noté sur la liste d'édition du point de vue "Informatique"
   Quand l'utilisateur "alice" ajoute l'utilisateur "alcarazc" à la liste d'édition du point de vue "Informatique"
   Alors l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Informatique"
   Et l'utilisateur "alcarazc" est noté sur la liste d'édition du point de vue "Informatique"
   
Scénario: L'utilisateur ne peut pas ajouter un contributeur à la liste d'édition

   Soit "eut-skills" le portfolio ouvert
   Et l'utilisateur "alice" est connecté
   Et l'utilisateur "alice" n'est pas noté sur la liste d'édition du point de vue "Mécanique"
   Et l'utilisateur "alcarazc" n'est pas noté sur la liste d'édition du point de vue "Mécanique"
   Quand l'utilisateur "alice" ajoute l'utilisateur "alcarazc" à la liste d'édition du point de vue "Mécanique"
   Alors l'utilisateur "alice" n'est noté pas sur la liste d'édition du point de vue "Mécanique"
   Et l'utilisateur "alcarazc" n'est pas noté sur la liste d'édition du point de vue "Mécanique"
