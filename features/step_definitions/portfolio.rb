﻿require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le corpus {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("{string} le portfolio spécifié dans la configuration") do |portfolio|
  case portfolio
  when "vitraux"
    true #current configuration
  when "indéfini"
    pending "alternate configuration"
  else
    false
  end
end

# Events

Quand("un visiteur ouvre la page d'accueil du site") do
  visit "/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
end

# Outcomes

Alors("le titre affiché est {string}") do |portfolio|
  expect(page).to have_content(portfolio)
end

Alors("un des points de vue affichés est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("un des corpus affichés est {string}") do |corpus|
  expect(page).to have_content corpus
end

# For every topic, get the number of selected items assigned to it (see #37)
# get_number_selected_items_assigned_to_topic.feature

Soit("un visiteur ouvre la page d'accueil") do
  visit "/"
end

# Events

Quand("un visiteur sélectionne:") do |table|
  # table is a Cucumber::Ast::Table
  page.all(:css, '.Bullet').each do |el|
    el.click
  end
  table.hashes.each do |value|
    click_on value['selected']
  end
end


# Outcomes

Alors("chaque thème dans tous les points de vue affiche:") do |table|
  # table is a Cucumber::Ast::Table
  table.hashes.each do |value|
    expect(page).to have_content("#{value['theme']}")
    expect(page).to have_content("(#{value['number']})")
  end
end
