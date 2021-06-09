Alors ("l'item {string} est affiché") do |item|
  expect(page).to have_content item
end

Alors ("l'item {string} est caché") do |item|
  expect(page).not_to have_content item
end

Alors("la rubrique {string} est sélectionnée") do |topic|
  expect(find('.TopicTag')).to have_content topic
end

Alors("le titre de l'item affiché est {string}") do |item|
  expect(find('.Subject h2')).to have_content item
end

Alors("la valeur de l'attribut {string} est {string}") do |attribute, value|
  expect(page).to have_content value
  expect(page).to have_content attribute
end

Alors("une des rubriques de l'item est {string}") do |topic|
  expect(page).to have_css '.Topic', text: topic
end

Alors("{string} mène à une page intitulée {string}") do |uri, title|
  click_link uri
  expect(page.title).to have_content title
end

Alors("l'attribut {string} est sélectionné") do |attribute|
  expect(find('.TopicTag')).to have_content attribute
end

Alors("la page contient {string}") do |localization|
  expect(page).to have_content localization
end

Alors("l'appellation du point de vue est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("l'utilisateur {string} est noté sur la liste d'édition du point de vue {string}") do |user, viewpoint|
  expect(page).to have_content viewpoint
  expect(page).to have_content user
  expect(page).not_to have_content 'Pas de contributeurs'
end

Alors("l'utilisateur {string} n'est pas noté sur la liste d'édition du point de vue {string}") do |user, viewpoint|
  expect(page).to have_content viewpoint
  expect(page).not_to have_content user
  expect(page).not_to have_content 'Pas de contributeurs'
end
