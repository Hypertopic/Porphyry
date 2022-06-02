Alors ("l'item {string} est affiché") do |item|
  expect(find('.Items')).to have_content item
end

Alors ("l'item {string} est caché") do |item|
  expect(find('.Items')).not_to have_content item
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

Alors('l’utilisateur {string} est connecté') do |user|
  expect(page).to have_content user
end

Alors("l'utilisateur est redirigé vers la page d'édition de l'item {string}") do |item|
  expect(find('.Subject h2')).to have_content item
end

Alors("L’utilisateur n’est pas connecté") do
  expect(page).to have_content "Se connecter..."
end

Alors('le point de vue contient la rubrique {string}') do |topic|
  expect(page).to have_content topic
end

Alors("la recherche est {string} et {string}") do |search1, search2|
  expect(page).to have_content search1
  expect(page).to have_content search2
end

Alors('le point de vue {string} ne fait plus partie du portfolio') do |viewpoint|
  expect(page).not_to have_content viewpoint
end

Alors("la légende de l’image est {string}") do |legend|
  expect(find(".Copyright")).to have_content legend
end

Alors("l'attribut {string} est absent") do |attribute|
  expect(find(".Attributes")).not_to have_content attribute
end

Alors ("{string} est l'item affiché") do |item|
  expect(page).to have_content item
end
