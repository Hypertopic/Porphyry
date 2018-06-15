require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Outcomes

Quand("l`utilisateur supprime la catégorie {string}") do |topicToBeRemoved|
  page.find("span", text: topicToBeRemoved).hover
  click_on('❌')
end

Alors("la catégorie {string} disparait de l`arborescence") do |topicToBeRemoved|
  expect(page).not_to have_content(topicToBeRemoved)
end
