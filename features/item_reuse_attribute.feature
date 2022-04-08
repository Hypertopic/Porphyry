Scénario 1 : En créant un attribut et une valeur inexistants

Soit l’utilisateur “luce” est connecté 
Et l’utilisateur souhaite éditer l’item “KER 0434”
Quand l’utilisateur renseigne un nouvel attribut en saisissant “spécialité” et la valeur “honorifique”
Alors l’attribut "spécialité" et la valeur ”honorifique” sont créés dans l’item “KER 0434” 
Mais  l’utilisateur ne choisit pas l’attribut "spatial" proposé
Et l’utilisateur ne choisit pas l’attribut “spécificité” proposé


Scénario 2 : En renseignant un attribut et une valeur inexistante

Soit l’utilisateur “luce” est connecté 
Et l’utilisateur souhaite éditer l’item “KER 0434”
Quand l’utilisateur renseigne l’attribut "spatial" préexistant avec une nouvelle valeur “Tombe 1999, Nécropole de l’Ouest de l’Eridanos, Kerameikos" 
Alors l’attribut "spatial" et la valeur “Tombe 1999, Nécropole de l’Ouest de l’Eridanos, Kerameikos" sont créés dans l’item “KER 0434” 



Scénario 3 :  En renseignant un attribut et une valeur existants

Soit l’utilisateur “luce” est connecté 
Et l’utilisateur souhaite éditer l’item “KER 0434”
Quand l’utilisateur renseigne l’attribut "spatial" avec  une nouvelle valeur en saisissant les lettres “To”
Alors l’utilisateur choisit la valeur "Tombe 4, Nécropole au Nord de l’Eridanos, Kerameikos" proposé parmi les autres valeurs existantes
Et l’attribut "spatial" et la valeur "Tombe 4, Nécropole au Nord de l’Eridanos, Kerameikos" sont créés dans l’item “KER 0434” 