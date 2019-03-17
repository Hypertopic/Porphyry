require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

#Conditions

Soit ("l'utilisateur {string} se connecte avec mot de passe {string}") do |user,password|
  click_on('Se connecter...')
  fill_in("nom d'utilisateur", with: user )
  fill_in("mot de passe", with: password)
  click_on('Se connecter')
  expect(page).to have_link("Se déconnecter")
end

Soit ("on ouvre la page de creation du point de vue") do
  click_on('Nouveau point de vue')
end

#Events

Quand ("on ajoute le point de vue {string}") do |point_of_view|
  fill_in("Nom du point de vue", with: point_of_view )
  find_button(type:"submit").click
end

# Outcomes

Alors("le point de vue {string} est affiché") do |point_of_view|
  expect(page).to have_content(point_of_view)
end
