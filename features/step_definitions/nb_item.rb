require 'capybara/cucumber'
require 'selenium/webdriver'


Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10


# Conditions
Soit("la page d'accueil chargée") do

end

# Events


Quand("un utilisateur visite la page d'accueil") do
  visit "/"

end

# Outcomes

Alors("le portfolio {string} est présent") do |portfolio|
  expect(page).to have_content(portfolio)
end

Alors("le viewpoint {string} est présent") do |viewpoint|
  expect(page).to have_content(viewpoint)
end

Alors("le topic {string} est présent") do |topic|
  expect(page).to have_content(topic)
end


# Events
Quand("un utilisateur clique sur le topic {string}") do |topic|
  click_on(topic)
end
# Outcomes
Alors("le nombre d'item {int} est affiché à côté du topic {string}") do |nb, topic|
  expect(page).to have_content(topic+ " (" + nb.to_s + ")")
end
