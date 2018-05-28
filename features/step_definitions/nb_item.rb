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
Alors("le viewpoint {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  expect(page).to have_content(viewpoint)
  expect(page).to have_content(portfolio)
end

Alors("le topic {string} attribué au viewpoint {string}") do |viewpoint, topic|
  expect(page).to have_content(viewpoint)
  expect(page).to have_content(topic)
end

Alors("le topic {string} attribué au topic {string}") do |topic1, topic2|
  expect(page).to have_content(topic1)
  expect(page).to have_content(topic2)
end
# Events
Quand("un utilisateur clique sur le topic {string}") do |topic|
  click_on(topic)
end
# Outcomes
Alors("le nombre d'item {int} est affiché à côté du topic {string}") do |nb, topic|
  expect(page).to have_content(topic+ " (" + nb.to_s + ")")
end
