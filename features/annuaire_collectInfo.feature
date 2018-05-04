#language: fr

Fonctionnalité: Récupérer le profil à partir des informations du LDAP

Contexte:
Soit les informations de NOM_ETU stocké dans le serveur utt
Soit le lgoin de NOM_ETU qui est LOGIN_ETU
Soit le mot de passe de NOM_ETU qui est PASSWORD

Scénario: Récupérer le profil avec une bonne combinaison de login

  Soit le pop-up LDAP affiché sur la page d'accueil du site
  Quand un visiteur saisit LOGIN_ETU dans le champs login et PASSWORD dans le champs mot de passe et il clique sur valider
  Alors le pop-up se ferme
  Et un des points de vue affichés est "Fonction"
  Et un des points de vue affichés est "UE"
  Et un des points de vue affichés est "Compétence"
  Et un des points de vue affichés est "Centre d'intérêt"

Scénario: Récupérer le profil avec un faux login

  Soit le pop-up LDAP affiché sur la page d'accueil du site
  Quand un visiteur saisit LOGIN_ETU_FAUX dans le champs login et PASSWORD dans le champs mot de passe et il clique sur valider
  Alors le pop-up LDAP rest sur la page

Scénario: Récupérer le profil avec un faux mot de passe

  Soit le pop-up LDAP affiché sur la page d'accueil du site
  Quand un visiteur saisit LOGIN_ETU dans le champs login et PASSWORD_FAUX dans le champs mot de passe et il clique sur valider
  Alors le pop-up LDAP rest sur la page
