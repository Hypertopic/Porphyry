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



########
#  TEST: Consult topics and attributes related to an item (see commit 0734b36)
#  consult_item_topics_attributes.feature
########

# Conditions	

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|	
  # On the remote servers	
end	
	
Soit("le thème {string} rattaché au point de vue {string}") do |theme, viewpoint|	
  # On the remote servers	
end	
	
Soit("le thème {string} rattaché au thème {string}") do |theme, theme1|	
  # On the remote servers	
end	
	
Soit ("l'item {string} rattaché aux thèmes {string} et {string}") do |item, theme, theme1|	
   # On the remote servers	
end	
	
Soit ("{string} la valeur de l’attribut {string} rattaché à l’item {string}") do |value, attribut ,item|	
   # On the remote servers	
end	
	
Soit("{string} un item affiché dans la vue courante du visiteur") do |item|	
  case item	
  when "ABT" 	
    true #current configuration	
  else	
    false	
  end	
end	
	
# Events 	
	
Quand("le visiteur sélectionne l’item {string}") do |string|	
  visit "/item/Vitraux%20-%20Recensement/"	
end	
	
# Outcomes	
	
Alors("le titre affiché est {string}") do |item|	
  expect(page).to have_content(item)	
end	
	
Alors("un des attributs affichés a la valeur {string}") do |value|	
  expect(page).to have_content(value)	
end	
	
Alors("un des points de vue affichés est {string}") do |viewpoint|	
  expect(page).to have_content(viewpoint)	
end	
	
Alors("un des thèmes affichés du point de vue {string} est {string}") do |viewpoint, theme|	
  expect(page).to have_content(viewpoint)	
  expect(page).to have_content(theme)	
end	
	
Alors("le titre de l’item affiché est {string}") do |item|	
  expect(page).to have_content(item)	
end	
	
Alors("un des thèmes affichés rattaché au thème {string} est {string}") do |theme, theme1|	
  expect(page).to have_content(theme)	
  expect(page).to have_content(theme1)	
end	
	
Et("{string}la valeur de l’attribut {string} rattaché à l’item {string}") do |value, attribut, item|	
  expect(page).to have_content(value)	
  expect(page).to have_content(attribut)	
  expect(page).to have_content(item)	
end 