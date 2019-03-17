require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("le point de vue {string} rattaché au portfolio {string}") do |string, string2|
end
# Events

Quand("un visiteur clique sur l'option {string}") do |value|
  click_on(value)
end

Quand("tape {string}") do |string|
  fill_in(find(".active"), :with => string)
end

Quand("clique sur le bouton de validation") do
  find(:xpath, %(//*[@id="validateButton-vitraux"])).click
end

# Outcomes

Alors("le point de vue {string} apparait dans la page d'accueil") do |viewpoint|
  expect(page).to have_content(viewpoint)
end
