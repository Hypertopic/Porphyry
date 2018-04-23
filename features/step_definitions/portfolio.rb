require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("un visiteur ouvre la page d'accueil du site") do
  visit "/"
end

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le corpus {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
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

Soit("le thème {string} est choisi") do |topic|
  click_on topic
end

Soit("{string} est affiché") do |item|
  true # good-for-nothing
end

Soit("{string} n'est pas affiché") do |item|
  true # good-for-nothing
end

# Events 

Quand("un visiteur ouvre la page d'accueil du site") do
  visit "/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
end

Quand("le thème {string} est sélectionné") do |topic|
  click_on topic
end

Quand("le thème {string} est désélectionné") do |topic|
  click_on topic
end

# Outcomes

Alors("le titre affiché est {string}") do |portfolio|
  expect(page).to have_content(portfolio)
end

Alors("un des points de vue affichés est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("un des corpus affichés est {string}") do |corpus|
  expect(page).to have_content corpus
end

Alors("le sous-titre est {string}") do |status|
  expect(page).to have_content status
end

Alors("le nombre d'items affichés dans le vitrine est {int}") do |nbItems|
  expect(page).to have_selector('.Items > .Item', count: nbItems)
end

Alors("la vitrine contient {string}") do |item|
  expect(page).to have_content item
end

Alors("la vitrine ne contient pas {string}") do |item|
  expect(page).to have_no_content item
end