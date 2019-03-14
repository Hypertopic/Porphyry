require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10
Capybara.exact = true

Soit("la page {string} rattaché au point de vue {string}") do |string, string2|
  # On server side
end

Soit("la catégorie {string} rattaché au point de vue {string}") do |string, string2|
  # On server side
end

Soit("{string} la page ouverte") do |titlePage|
  visit "/viewpoint/a76306e4f17ed4f79e7e481eb9a1bd06"

  expect(find("h2.h4")).to have_content(titlePage)
end

Soit(/^l'utilisateur est connecté avec le mot de passe$/) do
  click_on('Se connecter...')
  fill_in("nom d'utilisateur", with: "alice")
  fill_in("mot de passe", with: "whiterabbit")

  click_on('Se connecter')
end

Soit("le point de vue {string} est développé") do |viewpoint|
  expect(find('.Outliner li.open', match: :first)).to have_content(viewpoint)

end

Quand("la catégorie {string} est modifiée en {string}") do |oldCategory, newCategory|
  find("span.node", :text => oldCategory).double_click
  find('input[value="' << oldCategory << '"]').set(newCategory)
  find("h2").double_click
end

Alors("la catégorie {string} n'est plus affiché") do |viewpoint|
  expect(page).not_to have_content(viewpoint)
end

Alors("la catégorie {string} est affiché") do |viewpoint|
  expect(find("span.node", exact_text: viewpoint)).to have_content(viewpoint)
end