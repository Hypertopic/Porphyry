require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("{string} l\'item affiché") do |item|
  visit "/"
  click_on item
end


# Events

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

# Outcomes
