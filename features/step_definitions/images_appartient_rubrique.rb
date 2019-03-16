require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

def getUUID2(itemName)
  uuid = nil
  case itemName
    when "Hugot"
      uuid = "8c4b184d5d6b0f40919f690f1f6ca7f5"
    when "Édouard-Amédée Didron"
      uuid = "8f57e7ea7d7b804a9fef571018e6384b"
  end
  return uuid
end

# Conditions

Soit("la rubrique {string} rattaché au point de vue {string}") do |topic3, topic1|
  # On the remote servers
  # topic3 is "Hugot"
end


Soit("la rubrique {string} sélectionnée et dévellopée") do |topic1|
	visit "/"
end

Quand("la rubrique {string} est sélectionnée") do |topic3|
	visit "/?t=#{getUUID2(topic3)}"
	#je veux utiliser la fonction getUUID, mais il retourne nil. Donc je donne une variable fixe pour tester.
end


Alors("l'emplacement des items est vide") do
  expect(page).not_to have_selector('.Item')
end

Alors("tous les items sont affichés et doivent appartenir à la rubrique {string}") do |topic3|
  links =[]
  all('.Item').each{
      |a| links += [a.find('a')[:href]]
  }
  for link in links
      visit link
      expect(page).to have_content topic3
      end
end

