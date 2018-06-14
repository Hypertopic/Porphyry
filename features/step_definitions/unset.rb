require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions
Soit("l'Item {string} rattache au portfolio {string}") do |item, portfolio|
  # On the remote servers
end

Soit("l'Item {string} ayant l'AttributeName {string}") do |item, attributName|
  # On the remote servers
end

Soit("l'AttributeName {string} étant avec l'AttributeValue {string}") do |attributName, attributeValue|
  # On the remote servers
end

Soit("{string} le portfolio spécifié dans la configuration") do |portfolio|
  case portfolio
  when "vitraux"
    true #current configuration
  when "indéfini"
    pending "alternate configuration"
  else
    false
  end
end

# Events
Quand("l'utilisateur ouvre la page d'accueil") do
  visit "/"
end

Quand("l'utilisateur clique l'Item {string}") do |item|
  visit "http://localhost:3000/item/Vitraux%20-%20Recensement/a56aa07e9e03c5fca2048bc6ab0b922578b405cc"
end

Quand("l'utilisateur clique le bouton {string}") do |button|
  click_button (button)
end

Quand("l'utilisateur clique le bouton {string} à côté de l'AttributeName {string}") do |button,attributName|
  find_by_id("spatialButton").click

end

# Outcomes

Alors("l'AttributeName {string} est enlevé dans la base de données") do |attributName|
  page.should have_no_selector(attributName)

end
