require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions
Soit("la page d un vitrail avec comme attribut {string}") do |attribut|

end

Soit("comme attribut {string}") do |attribut|

end

Soit("avec un point de vue {string}") do |viewpoint|

end

Soit("avec comme thème {string}") do |theme|

end


# Events

Quand("un visiteur accède à la page d'accueil et clique sur le vitrail {string}") do |item|
  visit "/item/Vitraux - Bénel/49ad76c422158e66a5ec70aead5f14715901f0b6"
end

Alors("un titre s affiche avec le nom du vitrail ici {string}") do |attribut|
  expect(page).to have_content(attribut)
end

Alors("une image du vitrail apparaît") do
  expect(page).to have_selector('img')
end

Alors("apparaît l attribut du document {string}") do |attribut|
  expect(page).to have_content(attribut)
end

Alors("apparaît le point de vue {string}") do |viewpoint|
  expect(page).to have_content(viewpoint)
end

Alors("apparaît le thème {string}") do |theme|
  expect(page).to have_content(theme)
end
