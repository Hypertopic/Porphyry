require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

Quand("un visiteur ajoute un nouveau point de vue {string}") do |string|
  visit "/"
  click_on("Nouveau point de vue")
  expect(page).to have_content("Création du point de vue")
  fill_in(name: 'newTitle', with: string)
  click_on(class: 'add')
  visit "/"
  expect(page).to have_content string
end
