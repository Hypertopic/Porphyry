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

Soit("le corpus {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

# Conditions getItems

Soit("{string} le portfolio spécifié dans la configuration") do |portfolio|
  case portfolio
  when "vitraux"
    true
  when "indéfini"
    pending "alternate configuration"
  when "GRV 005"
    visit "http://localhost:3000/item/Vitraux%20-%20B%C3%A9nel/5b2087c08dc23458af4db4f6562a814b9e73883b"
  else
    false
  end
end

# Events

Quand("un visiteur ouvre la page d'accueil du site") do
  visit "http://localhost:3000/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
end

# Events getItems

Quand("un visiteur clique le thème {string} dans le point de vue {string}") do |theme, viewpoint|
  click_on theme
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
# Outcomes getItems
Alors("le thème affiché est {string}") do |theme|
  expect(page).to have_content(theme)
end
