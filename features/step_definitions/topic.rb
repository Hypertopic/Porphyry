require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

Quand("l`utilisateur clique le bouton d'ajout à côté de {string}") do |string|
  find("span", text: string).hover.find("span.oi-plus").click
end

Quand("l`utilisateur entre {string} dans le champ de texte apparait sous {string} et tappe Entrée") do |string, string2|
  find("input[value='']").set(string).native.send_keys(:return)
end

Alors("la catégorie {string} apparait sous {string}") do |string, string2|
  expect(page).to have_css("span", text: string)
  expect(page).to have_css("span", text: string2)
end

Soit("la catégorie {string} sous la catégorie {string}") do |string, string2|
  find("span", text: string2).hover.find("span.oi-plus").click
  find("input[value='']").set(string).native.send_keys(:return)
end

Alors("la catégorie {string} est de même niveau de la catégorie {string} sous {string}") do |string, string2, string3|
  expect(page).to have_css("span", text: string)
  expect(page).to have_css("span", text: string2)
  expect(page).to have_css("span", text: string3)
end

Alors("la catégorie {string} n'est plus affichée") do |string|
  expect(page).not_to have_css("span", text: string)
end

Alors("la catégorie {string} est affiché") do |string|
  expect(page).to have_css("span", text: string)
end

Quand("l`utilisateur clique le bouton de suppression à côté de {string}") do |string|
  find("span", text: string).hover.find("span.oi-x").click
end