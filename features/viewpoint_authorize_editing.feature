#language: fr

Fonctionnalité: Autoriser ou non un utilisateur à éditer un point de vue

Scénario: Le contributeur est l'auteur d'un point de vue

   Soit l'utilisateur "alice" est connecté
   Et "Informatique" un nouveau point de vue
   Alors l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Informatique"

Scénario: L'utilisateur est noté sur la liste d'édition du point de vue

   Soit l'utilisateur "alice" est connecté
   Et "Mécanique" un nouveau point de vue
   Et l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Mécanique"
   Quand l'utilisateur "alice" modifie l'appellation du point de vue "Mécanique" par "Matériaux"
   Alors l'appellation du point de vue est "Matériaux"

Scénario: L'utilisateur ajoute un contributeur à la liste d'édition

   Soit l'utilisateur "alice" est connecté
   Et "Génie industriel" un nouveau point de vue
   Et l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Génie industriel"
   Et l'utilisateur "noels" n'est pas noté sur la liste d'édition du point de vue "Génie industriel"
   Quand l'utilisateur "alice" ajoute l'utilisateur "noels" à la liste d'édition du point de vue "Génie industriel"
   Alors l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Génie industriel"
   Et l'utilisateur "noels" est noté sur la liste d'édition du point de vue "Génie industriel"

#Scénario: L'utilisateur ne peut pas ajouter un contributeur à la liste d'édition

 #  Soit "Génie logiciel" un nouveau point de vue
  # Et l'utilisateur "alice" est connecté
   #Et l'utilisateur "alice" n'est pas noté sur la liste d'édition du point de vue "Génie logiciel"
   #Et l'utilisateur "alcarazc" n'est pas noté sur la liste d'édition du point de vue "Génie logiciel"
   #Quand l'utilisateur "alice" ajoute l'utilisateur "alcarazc" à la liste d'édition du point de vue "Histoire de l'art"
   #Alors l'utilisateur "alice" n'est pas noté sur la liste d'édition du point de vue "Histoire de l'art"
   #Et l'utilisateur "alcarazc" n'est pas noté sur la liste d'édition du point de vue "Histoire de l'art"

#Scénario: La liste d'édition du point de vue n'est pas définie

  #Soit l'utilisateur "alice" est connecté
  #Et la liste d'édition du point de vue "Médiation culturelle" n'existe pas
  #Quand l'utilisateur "alice" modifie l'appellation du point de vue "Médiation culturelle" par "Culture"
 # Alors l'appellation du point de vue est "Culture"

#Scénario: L'utilisateur n'est pas noté sur la liste d'édition du point de vue

  #Soit l'utilisateur "alice" est connecté
  #Et l'utilisateur "alice" n'est pas noté sur la liste d'édition du point de vue "Histoire de l'art"
  #Quand l'utilisateur "alice" modifie l'appellation du point de vue "Histoire de l'art" par "Art"
  #Alors l'appellation du point de vue est "Histoire de l'art"
