require 'capybara/cucumber'
require 'capybara/cuprite'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("{string} l'item affiché") do |item|
  click_on item
end

Soit("l'item {string} sélectionné") do |string|
  # TODO: Implement test
end

# Events

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

Quand("on ajoute une ressource {string} à un item") do |string|
  # TODO: Implement test
end

# Outcomes

Alors("le titre de l'item affiché est {string}") do |item|
  expect(find(".Subject h2")).to have_content(item)
end

Alors("la valeur de l'attribut {string} est {string}") do |attribute, value|
  expect(page).to have_content(value)
  expect(page).to have_content(attribute)
end

Alors("une des rubriques de l'item est {string}") do |topic|
  expect(page).to have_content(topic)
end

Alors("la ressource {string} est ajoutée à la liste des ressources associées à l'item {string}") do |string, string2|
  # TODO: Implement test
end
