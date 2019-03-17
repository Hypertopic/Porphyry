require 'capybara/cucumber'
require 'capybara/cuprite'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

#Conditions

Soit("le portfolio {string}") do |nomPOV|
  # On the remote servers
end

Soit("le point de vue {string} rattaché au portfolio {string}") do |pov, portfolio|
  # On the remote servers
end

Soit("le portfolio {string} ouvert") do |portfolio|
  expect(page).to have_content(portfolio)
end

Soit("l'interface de création du point de vue ouverte") do
  expect(page).to have_content("Création du point de vue")
end

Soit("un nom de point de vue {string}") do |nomPOV|
  pending # Write code here that turns the phrase above into concrete actions
end

Quand("l'utilisateur spécifie et valide le point de vue {string}") do |nomPOV|
  pending # Write code here that turns the phrase above into concrete actions
end

Alors("le point de vue {string} est affiché à l'accueil du portfolio {string}") do |nomPOV, portfolio|
  expect(page).to have_content(portfolio)
  expect(page).to have_content(nomPOV)
end
