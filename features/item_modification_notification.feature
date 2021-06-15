#language: fr
Fonctionnalité:  Etre informé d'un changement dans une catégorie

Scénario: suite à une modification d'item
Soit "Lauréats" une catégorie à laquelle l'utilisateur est abonné
Lorsque l'item "1994_6-9_11_ROM_R_C"  appartenant à la catégorie "Lauréats" est modifié
Alors l'utilisateur est informé de la modification de  l'item "1994_6-9_11_ROM_R_C"  par une notification dans son client RSS

Scénario:  suite à un ajout d'item
Soit "Lauréats" une catégorie à laquelle l'utilisateur est abonné
Lorsque l'item "1994_6-9_11_ROM_R_C"  est ajouté à la catégorie "Lauréats"
Alors l'utilisateur est informé de l'ajout de l'item "1994_6-9_11_ROM_R_C"  par une notification dans son client RSS
