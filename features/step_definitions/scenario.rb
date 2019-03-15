require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions
Soit("la page d'accueil ouverte") do
  visit('/')
end

Soit("le point de vue {string} rattaché au portfolio {string}") do |string, string2|
  page.has_content?(string2)
  page.has_content?(string)
end

Soit("la rubrique {string} rattachée au point de vue {string}") do |string, string2|
  find(".h4").find(string2)
  find(".Topics").find(string)
end

Soit("la rubrique {string} rattachée à la rubrique {string}") do |string, string2|
  find(".Topics").find(string)
  find(".Topics").find(string2)
end

Soit("le visiteur clique sur le bouton à coté du point de vue {string}") do |string|
  click_link(find(".h4").find(string).find_link(class: ['outliner']))
end

Soit("la page {string} du point de vue {string} est ouverte") do |string, string2|
  find(h2).value = string
  find(".node").find(string2)
end

Quand("un visiteur clique sur la rubrique {string}") do |string|
  click_on(find(".node").find(string))
end

Quand("presse la touche {string}") do |string|
  click_on("Entrée")
end

Quand("presse la touche {string}") do |string|
  click_on("Tabulation")
end

Quand("tape {string}") do |string|
  fill_in(find(".active"), :with => string)
end

Alors("la catégorie {string} est affichée sous la rubrique {string}") do |string, string2|
  page.has_content?(string2)
  page.has_content?(string)
end
