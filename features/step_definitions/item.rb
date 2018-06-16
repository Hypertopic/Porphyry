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

#Conditions update an item attributs
Soit("l'utilisateur ayant un Item lui correspondant au portfolio {string}") do |portfolio|

end

Soit("l'Item {string} comprenant l'AttributeName {string}")do |item, attributeName|

end

Soit("l'AttributeName {string} étant avec l'AttributeValue {string}")do |attributeName, attributeValue|

end

Soit("l'utilisateur étant sur la page de modification de profil")do

end

# Events

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

#Events update item's attributs
Quand("l'utilisateur ouvre la page d'accueil") do
  visit "/"
end

Quand("l'utilisateur clique l'Item {string}") do |item|
  visit "http://localhost:3000/item/Vitraux%20-%20Recensement/a56aa07e9e03c5fca2048bc6ab0b922578b405cc"
end

Quand("l'utilisateur clique le bouton {string}") do |button|
  click_button (button)
end

Quand("il modifie l'AttributeName {string} avec l'AttributeValue {string}")do |attributeName, attributeValue|
  fill_in 'address', :with => 'at UTT'
end

Quand("il clique sur le bouton {string}")do |button|
  click_button (button)
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

#Outcomes update item's attributs
Alors("le titre affiché est {string}") do |portfolio|
  expect(page).to have_content(portfolio)
end

Alors("un des points de vue affichés est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("un des corpus affichés est {string}") do |corpus|
  expect(page).to have_content corpus
end

Alors("la valeur de l'AttributeName {string} change de {string} à {string} dans la base de données") do |attributeName, attributeValue1,attributeValue2|
  expect(page).to have_content attributeName
  expect(page).to have_no_content attributeValue1
  expect(page).to have_content attributeValue2
end


Et("sur la page profil de cet utilisateur l'AttributeName {string} est avec l'AttributeValue {string}")do |attributeName, attributeValue|
  expect(page).to have_content(attributeName)
  expect(page).to have_content(attributeValue)
end
