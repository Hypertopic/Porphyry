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
    true
  when "indéfini"
    pending "alternate configuration"
  else
    false
  end
end

Soit("le topic {string} rattaché au point de vue {string}") do |topic, viewpoint|
  # On the remote servers
end

Soit("il y a {int} images correspondants au topic {string}") do |value, topic|
  # On the remote servers
end

Soit("il y a {int} images correspondants au topic {string} et {string}") do |value, topic, topic2|
  # On the remote servers
end

Soit ("il y a en total {int} images dans la bdd") do |value|
  # On the remote servers
end

Soit ("qu'il y que le topic {string} choisi") do |topic|
  visit "http://localhost:3000/?t=e37ef0ccede3cf4ea21913df8e57c790"
end

Soit ("qu'il y le topic {string} et le topic {string} choisis") do |topic, topic2|
  visit "http://localhost:3000/?t=5b28e10ce053ac46898fcb3aa7be9a05&t=c556d31576c0bc40953ca5e04ab3fc72"
end



# Events

Quand("un visiteur ouvre la page d'accueil du site") do
 visit "/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
end

Quand("un visiteur clique sur {string} dans la liste des topics") do |topic|
  click_on topic
end

# Outcomes

Alors("le titre affiché est {string}") do |portfolio|
  expect(page).to have_content(portfolio)
end

Alors("un des points de vue affichés est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("tous les items sont affichés") do
  visit "/"
end

Alors("tous les items concernant le topic {string} affichés") do |topic|
  expect(page).to have_content(topic)
end
Alors("le nombre des images correspontante change de {int} à {int}") do |value, value2|
  # On the remote servers
end
