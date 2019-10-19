require 'capybara/cucumber'
require 'capybara/cuprite'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = ENV["APP_HOST"] || "http://localhost:3000"
Capybara.default_max_wait_time = 10
Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(app,
    browser_options: { 'no-sandbox': nil },
    timeout: 30
  )
end

def getURI(name)
  uri = nil
  case name
    when "SNZ 006"
      uri = "/item/Vitraux%20-%20Bénel/8a1750b17b11944108efaac593f4448e4e9f966b"
  end
  return uri
end
