#language: fr

Fonctionnalité: Sélectionner des items en cherchant

Scénario: en remplaçant le ET par un OU négativement

  Soit "Datation|Personnages|Récits" les rubriques sélectionnées négativement
  Et "AXN 009" un des items affiché
  Et "PSM 002" un des items affiché
  Et "SMV 029" un des items affiché
  Et "SNZ 005" un des items affiché
  Et "SNZ 009" un des items affiché
  Quand l'utilisateur change l'opérateur entre la rubrique "Personnages" et la rubrique "Récits"
  Alors l'item "PSM 002" est caché
  Et l'item "SNZ 005" est caché