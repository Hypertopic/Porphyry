require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("l‘item affiché {string}") do |item|
  visit "/"
  expect(page).to have_content(item)
  click_on(item)
end


# Events

Quand("un visiteur clique sur le thème {string}") do |topic|
  click_on(topic)
end

# Outcomes
