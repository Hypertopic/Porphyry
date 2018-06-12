require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

def id()
  s = [*'a'..'z', *'A'..'Z', *'0'..'9'].shuffle[0, 8].join
end

def clickOnNewViewpointCreatorButton
  find(".ViewpointCreator a").click
end

viewpoint = "test" + id()

viewpointTextField = ".App h1 input[type='text']"
viewpointHeader = ".App h1"
buttonReturn = "button.Return"

# Conditions

Soit("l'utilisateur ouvre la page d'accueil du site") do
  visit "/"
end

Soit("un nouveau nom de viewpoint généré") do
  true
end

Soit("l'utilisateur ouvre la page de création de nouveau viewpoint") do
  visit "/"
  clickOnNewViewpointCreatorButton()
end

# Events

Quand("l'utilisateur crée un nouveau viewpoint") do
  clickOnNewViewpointCreatorButton()
end

Quand("l'utilisateur entre le nom de viewpoint") do
  find(:css, viewpointTextField).set(viewpoint)
  find(:css, viewpointTextField).native.send_keys(:return)
end

# Outcomes

Alors("la page de viewpoint s'ouvre") do
  expect(page).to have_current_path(/\/viewpoint\/\w+/)
end

Alors("la page de viewpoint contient un champ de texte dans le titre") do
  expect(page).to have_css(viewpointTextField)
end

Alors("la page de viewpoint contient un bouton homepage") do
  expect(page).to have_css(buttonReturn)
end

Alors("le champ de texte disparaît") do
  expect(page).not_to have_css(viewpointTextField)
end

Alors("le titre de page devient le nom de viewpoint") do
  expect(page).to have_selector(viewpointHeader, text: /#{viewpoint}/i)
end

Quand("l'utilisateur revient au portfolio") do
  find(buttonReturn).click
end

Alors("le portfolio contient le nom de viewpoint") do
  expect(page).to have_content(viewpoint)
end