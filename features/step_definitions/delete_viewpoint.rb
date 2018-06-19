require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

Soit("l`utilisateur dans le portfolio") do
  visit "/"
end

Soit("le point de vue {string} dans le portfolio") do |vp|
  find(".ViewpointCreator a").click
  find(:css, ".App h1 input[type='text']").set(vp)
  find(:css, ".App h1 input[type='text']").native.send_keys(:return)
  find(:css, "button.Return").click
end

Quand("l`utilisateur supprime le point de vue {string}") do |vp|
  accept_alert do
    find("h3", text: vp).find(:css, ".ViewpointDeletor").click
  end
end

Alors("le point de vue {string} dissparait du portfolio") do |vp|
  expect(page).not_to have_content(vp)
end