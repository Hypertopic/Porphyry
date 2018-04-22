require 'capybara/cucumber'
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

Quand("un visiteur {string}") do |useraction|
  case useraction
  when "ne sélectionne aucun thème"
    if page.current_url != Capybara.app_host
      visit "/"
      print page.current_url;
    end
  when "sélectionne un thème"
    visit "/?t=d8d2654decd91140bfd93a952817d852"
    print page.current_url;
  when "sélectionne plusieurs thèmes"
    visit "/?t=d8d2654decd91140bfd93a952817d852&t=9699bc2f8010944aa0574deabe8edb6d"
    print page.current_url;
  else
    false
  end
end


# Outcomes

Alors("chaque thème dans tous les points de vue affiche {string}") do |content|
  case content
  when "le nombre d'items qu'il contient"
    expect(page).to have_content("Artiste")
    expect(page).to have_content("(119)")
  when "le nombre d'items qu'il contient et qui a une relation avec le thème sélectionné"
    expect(page).to have_content("Albrecht Dürer (d'après)")
    expect(page).to have_content("(11)")
  when "le nombre d'items qu'il contient et qui a une relation avec les thèmes sélectionnés"
    expect(page).to have_content("Albrecht Dürer (d'après)")
    expect(page).to have_content("1er quart XVIe")
    expect(page).to have_content("(1)")
  end
end

