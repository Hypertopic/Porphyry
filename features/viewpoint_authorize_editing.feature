#language: fr

Fonctionnalité: Autoriser ou non un utilisateur à éditer un point de vue
	
Scénario: Le contributeur est l'auteur d'un point de vue

   Soit "eut-skills" le portfolio ouvert		
   Et l'utilisateur "alice" est connecté avec le mot de passe "whiterabbit"
   Et "Informatique" un nouveau point de vue
   Alors l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Informatique"

Scénario: L'utilisateur est noté sur la liste d'édition du point de vue

   Soit "eut-skills" le portfolio ouvert		
   Et l'utilisateur "alice" est connecté avec le mot de passe "whiterabbit"
   Et "Mécanique" un nouveau point de vue
   Et l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Mécanique"
   Quand l'utilisateur "alice" modifie l'appellation du point de vue "Mécanique" par "Matériaux"
   Alors l'appellation du point de vue est "Matériaux"

Scénario: L'utilisateur ajoute un contributeur à la liste d'édition

   Soit "eut-skills" le portfolio ouvert
   Et l'utilisateur "alice" est connecté avec le mot de passe "whiterabbit"
   Et "Génie industriel" un nouveau point de vue
   Et l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Génie industriel"
   Et l'utilisateur "noels" n'est pas noté sur la liste d'édition du point de vue "Génie industriel"
   Quand l'utilisateur "alice" ajoute l'utilisateur "noels" à la liste d'édition du point de vue "Génie industriel"
   Alors l'utilisateur "alice" est noté sur la liste d'édition du point de vue "Génie industriel"
   Et l'utilisateur "noels" est noté sur la liste d'édition du point de vue "Génie industriel"

   #Scénario: L'utilisateur n'est pas noté sur la liste d'édition du point de vue

   #Soit "eut-skills" le portfolio ouvert  
   #Et l'utilisateur "noels" est connecté
   #Et l'utilisateur "noels" n'est pas noté sur la liste d'édition du point de vue "Mécanique"
   #Quand l'utilisateur "noels" modifie l'appellation du point de vue "Mécanique" par "Informatique"
   #Alors l'appellation du point de vue est "Mécanique"


Scénario: L'utilisateur ne peut pas ajouter un contributeur à la liste d'édition

   Soit "eut-skills" le portfolio ouvert
   Et l'utilisateur "alice" est connecté avec le mot de passe "whiterabbit"
   Et "Génie logiciel" un nouveau point de vue
   Et l'utilisateur "alice" est déconnecté
   Et l'utilisateur "charlie" est connecté avec le mot de passe "chocolatefactory"
   Et l'utilisateur "charlie" n'est pas noté sur la liste d'édition du point de vue "Génie logiciel"
   Et l'utilisateur "alcarazc" n'est pas noté sur la liste d'édition du point de vue "Génie logiciel"
   Quand l'utilisateur "charlie" ajoute l'utilisateur "alcarazc" à la liste d'édition du point de vue "Génie logiciel"
   Alors l'utilisateur "alcarazc" n'est pas inscrit sur la liste d'édition du point de vue "Génie logiciel"
               
