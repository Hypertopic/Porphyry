#language: fr

Fonctionnalité: Ajouter une ressource en tant que fichier 


Scénario: Ajouter une ressource en tant que fichier 

Soit un item en cours d'édition
Et l'utilisateur connecté
Quand l'utilisateur dépose "pièce de monnaie.png" comme ressource
Alors la ressource "pièce de monnaie.png" est ajoutée 


Scénario: Consulter une ressource en tant que fichier 

Soit un utilisateur consulte un item 
Et la ressource "pièce de monnaie.png" existe comme ressource
Quand l'utilisateur consulte la ressource "pièce de monnaie.png" 
Alors la ressource "pièce de monnaie.png" est téléchargée