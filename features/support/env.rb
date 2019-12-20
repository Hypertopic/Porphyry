require 'capybara/cucumber'
require 'capybara/cuprite'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = ENV["APP_HOST"] || "http://localhost:3000"
Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(app,
    browser_options: { 'no-sandbox': nil },
    timeout: 30
  )
end
