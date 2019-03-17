require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

#Conditions

Soit("le point de vue {string} rattaché au portefolio {string}") do |viewpoint, portfolio|
  page.has_content?(viewpoint)
  page.has_content?(portfolio)
end

Soit("la catégorie {string} rattaché au point de vue {string}") do |category, viewpoint|
  find(".h4").find(string2)
  find(".Topics").find(string)
end

Soit("la catégorie {string} contenue dans la catégorie {string}") do |category1, category2|
  find(".Topics").find(category1)
  find(".Topics").find(category2)
end

Soit("la page de modification du point de vue {string} est affiché") do |viewpoint|
  click_link(find(".h4").find(viewpoint).find_link(class: ['outliner']))
end

Et("la catégorie {string} est déplié") do |category|
  find(".node").find(category)
end

#Events

Quand("on ajoute la sous-catégorie {string} à la catégorie {string}") do |string, string2|
  click_on(find(".node").find(category))
  click_on("Entrée")
  click_on("Tabulation")
  fill_in(find(".active"), :with => subCategory)
end

#Outcomes

Alors("la catégorie {string} apparait dans l'arborescence") do |string|
  page.has_content?(string)
end
