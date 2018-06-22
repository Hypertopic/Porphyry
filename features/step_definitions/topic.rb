require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

def id()
  s = [*'a'..'z', *'A'..'Z', *'0'..'9'].shuffle[0, 8].join
end

prefix = id() # pour cette session

Soit("l`utilisateur dans la page de modification du point de vue {string}") do |vp|
  visit "/"
  find("h3", text: vp).find("a span.oi-pencil").click
end

Soit("la catégorie {string} sous la catégorie {string}") do |string, string2|
  find("span", text: prefix + string2).hover.find("span.oi-plus").click
  find("input[value='']").set(prefix + string).native.send_keys(:return)
end

Quand("l`utilisateur clique le bouton d'ajout à côté du point de vue {string}") do |string|
  find("span", text: string).hover.find("span.oi-plus").click
end

Quand("l`utilisateur clique le bouton d'ajout à côté de la catégorie {string}") do |string|
  find("span", text: prefix + string).hover.find("span.oi-plus").click
end

Quand("l`utilisateur clique le bouton de suppression à côté de la catégorie {string}") do |string|
  find("span", text: prefix + string).hover.find("span.oi-x").click
end

Quand("l`utilisateur clique le bouton de modification à côté de la catégorie {string}") do |string|
  find("span", text: prefix + string).hover.find("span.oi-pencil").click
end

Quand("l`utilisateur change le nom de la catégorie {string} en {string} et tappe Entrée") do |string, string2|
  find("input[value='" + prefix + string + "']").set(prefix + string2).native.send_keys(:return)
end

Quand("l`utilisateur entre {string} dans le champ de texte apparait sous {string} et tappe Entrée") do |string, string2|
  find("input[value='']").set(prefix + string).native.send_keys(:return)
end

Alors("la catégorie {string} apparait sous le point de vue {string}") do |string, string2|
  expect(page).to have_css("span", text: prefix + string)
  expect(page).to have_css("span", text: string2)
end

Alors("la catégorie {string} est de même niveau de la catégorie {string} sous la catégorie {string}") do |string, string2, string3|
  expect(page).to have_css("span", text: prefix + string)
  expect(page).to have_css("span", text: prefix + string2)
  expect(page).to have_css("span", text: prefix + string3)
end

Alors("la catégorie {string} n'est plus affichée") do |string|
  expect(page).not_to have_css("span", text: prefix + string)
end

Alors("la catégorie {string} est affiché") do |string|
  expect(page).to have_css("span", text: prefix + string)
end