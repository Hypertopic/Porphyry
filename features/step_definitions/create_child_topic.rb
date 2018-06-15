require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

Quand("l`utilisateur crée la catégorie {string} sous le point de vue {string}") do |daughter, parent|
  page.find('span', text: parent).hover
  click_on('➕')
  find('input').set(daughter)
  find('input').native.send_keys(:return)  
end

Quand("l`utilisateur crée la catégorie {string} sous {string}") do |daughter, parent|
  page.find('span', text: parent).hover
  click_on('➕')
  find('input').set(daughter)
  find('input').native.send_keys(:return)  
end

Quand("l`utilisateur finit ce test") do
  true
end

Alors("la catégorie {string} apparait dans l`arborescence directement sous {string}") do |son, parent|
  expect(page).to have_content(son)
  expect(page).to have_content(parent)
end

Alors("la page supprime {string}") do |topic|
  page.find('span', text: topic).hover
  click_on('❌')
end