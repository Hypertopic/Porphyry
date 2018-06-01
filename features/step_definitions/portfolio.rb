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

###
# Consult items that match selected topics #54
# consult_topic_selected.feature
###

Quand("un visiteur sélectionne le thème {string}") do |theme|
    click_on(theme)
end

Alors("la liste des items en liens avec le thème est affichée") do
    expect(page).to have_selector(".Item",count: 66)
end

Soit("la page d'accueil chargée") do
  visit "/"
end

Soit ("le thème {string} présent sur la page") do |theme|
  expect(page).to have_content theme
end

Alors("le thème sélectionné est mis en subrillance") do
    expect(page).to have_selector(".Selected",count: 1)
end
