require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le regroupement de thèmes {string} rattaché au point de vue {string}") do |topic, viewpoint|
end

Soit("le thème {string} rattaché au regroupement de thèmes {string}") do |topic1, topic2|
end

Soit("l‘item {string} lié au thème {string}") do |item, topic|
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

# Events

Quand("un visiteur ouvre la page d‘accueil du site") do
  visit "/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
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

Alors("l‘item {string} est visible sur la page") do |item|
  expect(page).to have_content(item)
end

Alors("le thème {string} est visible sur la page") do |topic|
  expect(page).to have_content(topic)
end

Alors("le thème {string} est sélectionné") do |topic|
  expect(page).to have_selector('.Selected')
end
