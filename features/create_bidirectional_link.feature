#language: fr

Fonctionnalité: Créer un lien bidirectionnel

Scénario:

    Soit "NF05" l’item affiché    
    Quand l'utilisateur indique "NF04" comme "pré-requis"   
    Alors "NF04" est la destination du lien "pré-requis" de "NF05"     
    Et "NF05" est la source du lien "pré-requis" vers "NF04"
