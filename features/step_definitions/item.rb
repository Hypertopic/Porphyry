require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("{string} l'item affiché") do |item|
  visit "/"
  click_on item
end

#conditions set an item's attributs
Soit("le point de vue {string} rattaché à la page personelle") do |viewpoint|
end

Soit("le bouton {string} rattaché au point de vue {string}") do |button, viewpoint|
end

Soit("l'item {string} spécifié dans la configuration") do |item|
  visit "http://localhost:3000/item/Vitraux%20-%20B%C3%A9nel/11d3601f5f400071f968da6e192ddb7e86f27286"
end

Soit("le bouton {string} cliqué") do |button|
  click_button button
end
# Events

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

#Events set item's attributs

Quand("un visiteur clique sur le bouton {string}") do |button|
  click_button button
end

Quand("un visiteur saisit {string} dans le champ de nom de l'attribut") do |attribut_name|
  fill_in "key", with: attribut_name
end

Quand("il saisit {string} dans le champ de valeur de l'attribut") do |attribut_value|
  fill_in "value", with: attribut_value
end

Quand("il clique sur le bouton {string}") do |button|
  click_button button
end
# Outcomes

Alors("le titre de l'item affiché est {string}") do |item|
  expect(find("h1")).to have_content(item)
end

Alors("la valeur de l'attribut {string} est {string}") do |attribute, value|
  expect(page).to have_content(value)
  expect(page).to have_content(attribute)
end

Alors("une des rubriques de l'item est {string}") do |topic|
  expect(page).to have_content(topic)
end

#Outcomes set item
Alors("un champ de nom de l'attribut appelé {string} est affiché") do |attKey|
  expect(page).to have_field attKey
end

Alors("un champ de valeur de l'attribut appelé {string} est affiché") do |attValue|
 expect(page).to have_field attValue
end

Alors("un nouvel attibut {string} applé {string} est enregistré") do |attKey,attValue|
  expect(page).to have_css("div.Key", text: attKey, wait: 10)
  expect(page).to have_css("div.Value", text: attValue, wait: 10)
end
