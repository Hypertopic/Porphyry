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



























#checkTopics

Soit("le visiteur consulte le portfolio {string}") do |portfolio|
  case portfolio
  when "vitraux" 
    true
  when "indéfini" 
    pending "alternate configuration"
  else
    false
  end
end

Quand("un visiteur ne possède pas de catégorie sélectionnée") do
	expect(page).to have_no_selector(:css,".Selected")
end
Alors("tous les items du corpus sont visibles") do
  page.all(:css, '.Bullet').each do |element|
	element.click
	end
end

Quand("un visiteur a sélectionné la catégorie {string}") do |topic|
visit "/"	
find(:css,"#root>div>div.App-content>div.Description>div:nth-child(1)>div>ul>li:nth-child(1)>a:nth-child(2)").click
end

Alors("la catégorie {string} est surlignée") do |string|
expect(page).to have_selector(:css,"#root > div > div.App-content > div.Description > div:nth-child(1) > div > ul > li:nth-child(1) > a.Selected")
end
	
Quand("un visiteur a sélectionné la catégorie {string} et {string}") do |string, string2|
visit "/"
click_link("Artiste")
click_link("Datation")
end

Alors("la catégorie {string} et {string} sont surlignées") do |string, string2|
find(:css,"#root > div > div.App-content > div.Description > div:nth-child(1) > div > ul > li:nth-child(1) > a.Selected")
find(:css,"#root > div > div.App-content > div.Description > div:nth-child(1) > div > ul > li:nth-child(2) > a.Selected")
end

