require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit(" l'Item {string} rattaché au portfolio {string} ") do |item, portfolio|
  # On the remote servers
end

Soit(" l'Item {string} ayant au l'AttributeName {string} ") do |item, attributName|
  # On the remote servers
end

Soit(" l'AttributeName {string} ayant au l'AttributeValue {string} ") do |attributName, attributeValue|
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

Quand("l'utilisateur clique l'Item {string}") do |item|
  expect(page).to have_content(portfolio)
end

Quand(" l'utilisateur clique le bouton 'Modifier'") do
  click_on "Modifier"
end

Quand(" l'utilisateur clique le bouton 'Supprimer' à côté de l'AttributeName {string}") do |attributName|
  click_on "Supprimer"
end

# Outcomes

Alors("l'AttributeName {string} est enlevé dans la base de données") do |attributName|
  # On the remote servers
end
