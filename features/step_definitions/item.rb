require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("{string} l'item affiché") do |item|
  visit "/"
  click_on item
end


# Events

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

Quand("le visiteur veut attribuer le topic {string} au point de vue {string}") do |topic, viewpoint|
  expect(page).to have_content(viewpoint)
  expect(page).to have_no_content(topic)
  # Remplir la zone de texte :
  find(:xpath, '//input[@type="text"][@aria-owns="react-autowhatever-input-' + viewpoint + '"]').set(topic)
end

Quand("le visiteur veut enlever le topic {string} de l'item {string}") do |topic, item|
  expect(page).to have_content(topic)
end


# Outcomes

Alors("le titre de l'item affiché est {string}") do |item|
  expect(find("h1")).to have_content(item)
end

Alors("la valeur de l'attribut {string} est {string}") do |attribute, value|
  expect(page).to have_content(value)
  expect(page).to have_content(attribute)
end

Alors("une des rubriques de l'item est {string}") do |topic|
  expect(page).to have_content(topic)
end

Alors("la page affiche les différents topics, dont {string}") do |topic|
  expect(page).to have_content(topic.upcase)
end

Alors("le visiteur choisit le topic {string} du point de vue {string}") do |topic, viewpoint|
  find('a', text: topic.upcase).click
  find(:xpath, '//button[@id="validateButton-' + viewpoint + '"]').click
end

Alors("l'item {string} possède désormais le topic {string}") do |item, topic|
  expect(page).to have_content(topic)
end

Alors("le visiteur supprime le topic {string}") do |topic|
  find(:xpath, '//a[contains(text(),"' + topic + '")]/following-sibling::button').click
  page.driver.browser.switch_to.alert.accept
end

Alors("l'item {string} ne possède désormais plus le topic {string}") do |item, topic|
  expect(page).to have_no_content(topic)
end