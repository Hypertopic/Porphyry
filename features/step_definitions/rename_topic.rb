require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

Soit("la catégorie {string} sous {string}") do |topicToBeRenamed, parent|
  page.find('span', text: parent).hover
  click_on('➕')
  find('input').set(topicToBeRenamed)
  find('input').native.send_keys(:return)  
end

Quand("l`utilisateur change {string} en {string}") do |topicToBeRenamed, topicRenamed|
  page.find('span', text: topicToBeRenamed).hover
  click_on("✏️")
  find('input').set(topicRenamed)
  find('input').native.send_keys(:return)  
end

Alors("la catégorie {string} remplace {string}") do |topicRenamed, topicToBeRenamed|
  expect(page).to have_content(topicRenamed)
  expect(page).not_to have_content(topicToBeRenamed)
end