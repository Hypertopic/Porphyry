require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Outcomes

Soit("l`utilisateur dans la page de modification du point de vue {string}") do |pdv|
  visit "/"
  find("h3", :text => pdv).click_link("✏️")
end

Quand("l`utilisateur crée une catégorie soeur {string} de {string} qui est la fille de la catégorie {string}") do |sibling, topic, parent|
  page.find('span', text: parent).hover
  click_on('➕')
  find('input').set(sibling)
  find('input').native.send_keys(:return)  
end

Alors("la catégorie {string} apparait dans l`arborescence à côté de {string}") do |sibling, topic|
  expect(page).to have_content(sibling)
  expect(page).to have_content(topic)
end