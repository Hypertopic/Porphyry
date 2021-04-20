#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: une valeur d'attribut

 Soit "vitraux" le portfolio ouvert   
 Et "PSM 002" un des items affichés   
 Et "SJ 001" un des items affichés  
 Quand l'utilisateur recherche "creator" puis choisit "creator : Denis Krieger"   
 Alors l'item "PSM 002" est affiché   
 Mais l'item "SJ 001" est caché

