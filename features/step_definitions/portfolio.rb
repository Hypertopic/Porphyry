require 'capybara/cucumber'
require 'selenium/webdriver'

Capybara.run_server = false
Capybara.default_driver = :selenium_chrome_headless
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

def getUUID(itemName)
  uuid = nil

  case itemName
  when "Ateliers du Carmel du Mans"
    uuid = "0edea8e39068ed49a8f555a660d7cc68"
  when "David Tremlett"
    uuid = "7123a482ef397d4cb464ea3ec37655e0"
  when "1868"
    uuid = "29e7a2c6a601c040985ade144901cb1f"
  end

  return uuid
end

# Conditions

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le corpus {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le thème {string} rattaché au point de vue {string}") do |topic, viewpoint|
  # On the remote servers
end

Soit("l'item {string} rattaché au thème {string}") do |item, topic|
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

Soit("les thèmes {string} sont sélectionnés") do |topics|
  first = true
  uri = "/?"

  topics.split("|").each do |topic|
    uuid = getUUID(topic)

    if (first)
      uri += "t=" + uuid
      first = false
    else
      uri += "&t=" + uuid
    end
  end

  visit uri
end

Soit("la liste des thèmes sélectionnés est vide") do
  visit "/"
end

# Events

Quand("un visiteur ouvre la page d'accueil du site") do
  visit "/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
end

Quand("un visiteur clique sur le thème {string}") do |topic|
  click_link(topic)
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

# J'ai formulé cette étape de cette manière simplement car il n'est pas possible d'avoir une étape
# "Soit" et une étape "Alors" ayant toutes les deux la même formulation.

# Malgré ça, l'étape teste bien le fait que les thèmes sont sélectionnés par l'URL, ce qui n'a
# rien à voir avec l'affichage.

Alors("les thèmes {string} sont surlignés") do |topics|
  uri = URI.parse(current_url).to_s

  topics.split("|").each do |topic|
    uuid = getUUID(topic)

    if (uuid == nil)
      pending "undefined UUID"
    elsif (!uri.include? getUUID(topic))
      false
    end
  end

  true
end

Alors ("l'item {string} est affiché") do |item|
  expect(page).to have_content item
end

Alors ("l'item {string} n'est pas affiché") do |item|
  expect(page).not_to have_content item
end
