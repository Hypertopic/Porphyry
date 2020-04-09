Alors("le titre affiché est {string}") do |portfolio|
  expect(page).to have_content portfolio
end

Alors("un des points de vue affichés est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("un des corpus affichés est {string}") do |corpus|
  expect(page).to have_content corpus
end

Alors ("l'item {string} est affiché") do |item|
  expect(page).to have_content item
end

Alors ("l'item {string} n'est pas affiché") do |item|
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
