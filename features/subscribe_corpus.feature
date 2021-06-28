#language: fr

Fonctionnalité:  Etre informé des nouveautés relatives à un corpus

Scénario: suite à une modification d'item

Soit "Graines d'artistes" un corpus auquel l'utilisateur est abonné
Lorsque l'item "1997_MS_06_FRA_R_A"  est modifié
Alors l'utilisateur est informé de la modification de  l'item "1997_MS_06_FRA_R_A"  par une notification dans son client RSS

Scénario: suite à un ajout d'item

Soit "Graines d'artistes" un corpus auquel l'utilisateur est abonné
Lorsque l'item "1995_5-5_55_CRI_R_A"  est ajouté 
Alors l'utilisateur est informé de l'ajout de l'item "1995_5-5_55_CRI_R_A"  par une notification dans son client RSS

