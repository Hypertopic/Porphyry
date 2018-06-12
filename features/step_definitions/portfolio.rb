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
#  For every topic, get the number of selected items assigned to it (see #37)
#  get_number_selected_items_assigned_to_topic.feature
########
Soit("la page d'accueil chargée") do
  visit "/"
end

Soit("le topic {string} présent sur la page") do |topic|
  expect(page).to have_content(topic)
end

Quand("un utilisateur développe le topic {string} et clique sur le topic {string}") do |parentTopic, childTopic|
  page.all(:css, '.Bullet').each do |el|
    el.click
  end
  click_on(childTopic) 
end

Alors("Il doit y avoir au moins {int} items inscrits à côté de {string}") do |nbItems, topic|
  expect(page).to have_content(topic+" ("+nbItems.to_s+")")
end
