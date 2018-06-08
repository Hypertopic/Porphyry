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

Quand("un visiteur ouvre la page d'accueil du site") do
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

# Conditions


Soit("la page d'accueil chargée") do
  visit "/"
end

Soit("le topic {string} présent sur la page") do |topic|
  expect(page).to have_content(topic)
end

Soit("le topic {string} et {string} présentent sur la page") do |topic1,topic2|
  expect(page).to have_content(topic1)
  expect(page).to have_content(topic2)
end
# Events

Quand("un utilisateur clique sur le topic {string}") do |topic|
  click_link(topic)
end

Quand("un utilisateur clique sur deux topic {string} et {string}") do |topic1,topic2|
  visit "/"
  click_link(topic1)
  click_link(topic2)
end

# Outcomes

Alors("le topic {string} a class Selected") do |topic|
  page.find("a.Selected").should have_text(topic)
end

Alors("le number class Selected est 2") do
  expect(page).to have_selector("a.Selected", count: 2)
end
