#language : fr

Fonctionnalité: S'enregistrer en tant que contributeur

Scénario: avec un e-mail au format valide

	Soit l'utilisateur est sur la page d'édition de l'item "AXN 009"
	Quand "bob@acme.org" souhaite s'enregistrer comme contributeur en tant que "bob" avec le mot de passe "Ep0nge"
	Alors l’utilisateur "bob" est connecté
	Et l'utilisateur est redirigé vers la page d'édition de l'item "AXN 009"

Scénario: avec un e-mail au format non valide

	Soit l'utilisateur est sur la page d'édition de l'item "AXN 009"
	Quand "bobacme.org" souhaite s'enregistrer comme contributeur en tant que "bob" avec le mot de passe "Ep0nge"
	Alors L’utilisateur n’est pas connecté
