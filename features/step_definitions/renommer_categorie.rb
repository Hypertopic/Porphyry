require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

#Conditions

Soit("la page {string} rattachée au point de vue {string}") do |titlepage, viewpoint|
  # On the remote servers
end

Soit("la rubrique {string} rattachée au point de vue {string}") do |rubrique, viewpoint|
  # On the remote servers
end

Soit("la page {string} ouverte") do |titlepage|
  visit('/viewpoint/a76306e4f17ed4f79e7e481eb9a1bd06')
  expect(page).to have_content(titlepage)
end

Soit("le point de vue {string} développé") do |rubrique|
  #On the remote servers
end

#Events

Soit("l'utilisateur {string} connecté") do |utilisateur|
  click_link('Se connecter...')
  fill_in("nom d'utilisateur", with: 'alice')
  fill_in("mot de passe", with: 'whiterabbit')
  click_button('Se connecter')
end

Quand("la catégorie {string} est modifiée en {string}") do |ancienne, nouvelle|
  find('span', text: ancienne, match: :first).double_click
  find(:xpath, "//input[@value='Artiste']").set("").set(nouvelle)
end

#Outcomes

Alors("la catégorie {string} est supprimée") do |ancienne|
  expect(page).not_to_have_content(ancienne)
end

Et("la catégorie {string} est ajoutée") do |nouvelle|
  expect(page).to have_content(nouvelle)
end
