#language: fr

Fonctionnalité: Combiner les critères de sélection des items

Scénario: en ajoutant une rubrique par sélection

    Soit "La paix, le bien vivre ensemble" la rubrique sélectionnée
    Et "2018_10-13_BGR_1355_R_C" un des items affichés
    Et "2018_10-13_BRA_1607_R_C" un des items affichés
    Et "2018_10-13_KAZ_0053_R_C" un des items affichés
    Et "2018_10-13_SGP_1631_R_C" un des items affichés
    Et "2018_14-17_07_LTU_R_C" un des items affichés
    Et "2018_3-5_01_CAN_R_C" un des items affichés
    Et "2018_6-9_04_NLD_R_C" un des items affichés
    Et "2018_6-9_07_BEL_R_C" un des items affichés    
    Et "Nominés" une des rubriques développées
    Quand on sélectionne la rubrique "Lauréats"
    Alors l'item "2018_14-17_07_LTU_R_C" est affiché
    Et l'item "2018_3-5_01_CAN_R_C" est affiché
    Et l'item "2018_6-9_04_NLD_R_C" est affiché
    Et l'item "2018_6-9_07_BEL_R_C" est affiché
    Mais l'item "2018_10-13_BGR_1355_R_C" est caché
    Et l'item "2018_10-13_BRA_1607_R_C" est caché
    Et l'item "2018_10-13_KAZ_0053_R_C" est caché
    Et l'item "2018_10-13_SGP_1631_R_C" est caché

<<<<<<< HEAD
=======

Fonctionnalité: Combiner les critères de sélection des items

>>>>>>> 1c1e602f9a11de6dca5db0060c3d94e5d8f046d8
Scénario: en ajoutant une rubrique par recherche

    Soit "La paix, le bien vivre ensemble" la rubrique sélectionnée
    Et "2018_10-13_BGR_1355_R_C" un des items affichés
    Et "2018_10-13_BRA_1607_R_C" un des items affichés
    Et "2018_10-13_KAZ_0053_R_C" un des items affichés
    Et "2018_10-13_SGP_1631_R_C" un des items affichés
    Et "2018_14-17_07_LTU_R_C" un des items affichés
    Et "2018_3-5_01_CAN_R_C" un des items affichés
    Et "2018_6-9_04_NLD_R_C" un des items affichés
    Et "2018_6-9_07_BEL_R_C" un des items affichés    
    Quand on recherche la rubrique "Lauréats"
    Alors l'item "2018_14-17_07_LTU_R_C" est affiché
    Et l'item "2018_3-5_01_CAN_R_C" est affiché
    Et l'item "2018_6-9_04_NLD_R_C" est affiché
    Et l'item "2018_6-9_07_BEL_R_C" est affiché
    Mais l'item "2018_10-13_BGR_1355_R_C" est caché
    Et l'item "2018_10-13_BRA_1607_R_C" est caché
    Et l'item "2018_10-13_KAZ_0053_R_C" est caché
    Et l'item "2018_10-13_SGP_1631_R_C" est caché