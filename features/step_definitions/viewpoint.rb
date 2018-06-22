require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 20

def id()
  s = [*'a'..'z', *'A'..'Z', *'0'..'9'].shuffle[0, 8].join
end

prefix = id() # pour cette session

# Conditions

Soit("l`utilisateur dans le portfolio") do
  visit "/"
end

# Events

Quand("l`utilisateur clique le bouton Nouveau point de vue") do
  find("button", text: "Nouveau point de vue").click
end

Quand("l`utilisateur entre {string} comme le nom de point de vue et tappe Entrée") do |vp|
  find("input[name='newTitle']").set(prefix + vp).native.send_keys(:return)
end

Quand("l`utilisateur clique le bouton de modification de point de vue {string} et ouvre la page de modification de point de vue") do |vp|
  find("h3", text: prefix + vp).find("a span.oi-pencil").click
end

Quand("l`utilisateur clique le bouton de modification à côté de {string}") do |string|
  find("span", text: prefix + string).hover.find("span.oi-pencil").click
end

Quand("l`utilisateur change le nom du point de vue {string} en {string} et tappe Entrée") do |string, string2|
  find("input[value='" + prefix + string + "']").set(prefix + string2).native.send_keys(:return)
end

Quand("l`utilisateur revient au portfolio en cliquant Retour à l'accueil") do
  find("a", text: "Retour à l'accueil").click
  page.evaluate_script 'window.location.reload()'
end

Quand("l`utilisateur clique le bouton de suppression de point de vue {string} et accept l'avertissement") do |string|
  accept_alert do
    find("h3", text: prefix + string).find("a span.oi-circle-x").click
  end
end

# Outcomes

Alors("le point de vue {string} est affiché") do |vp|
  expect(page).to have_css("h3", text: prefix + vp)
end  

Alors("le point de vue {string} n'est plus affiché") do |string|
  expect(page).not_to have_css("h3", text: prefix + string)
end