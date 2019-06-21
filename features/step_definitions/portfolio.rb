require 'capybara/cucumber'
require 'capybara/cuprite'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = "http://vitraux.local:3000"
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
    when "Figuration du donateur"
      uuid = "fe94b684b6a42c4889c1e0d7458b9526"
  end
  return uuid
end


def getPassword(username)
  password = nil
  case username
  when "alice"
    password = "whiterabbit"
  end
  return password
end
# Conditions

Soit("l'item {string} existant") do |item|
  # On the remote servers
end

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le corpus {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("la rubrique {string} contenue dans la rubrique {string}") do |topic1, topic2|
  # On the remote servers
end

Soit("{int} items décrits par {string} et {string}") do |itemsNb, topic1, topic2|
  # On the remote servers
end

Soit("la rubrique {string} rattachée au point de vue {string}") do |topic, viewpoint|
  # On the remote servers
end

Soit("l'item {string} rattaché à la rubrique {string}") do |item, topic|
  # On the remote servers
end

Soit("l'utilisateur est connecté") do
  find_link(href: '#login').click
  fill_in("Nom d'utilisateur", with: "alice")
  fill_in("Mot de passe", with: "whiterabbit")
  click_on('Confirmer')
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

Soit("{string} le portfolio ouvert") do |portfolio|
  visit "/"
end

Soit("{string} une des rubriques développées") do |topic|
  find_button(topic).sibling('.oi').click
end


Soit("{string} la valeur de l'attribut {string} de l'item {string}") do |value, attribute ,item|
   # On the remote servers
end

# Events
Soit("les rubriques {string} sont sélectionnées") do |topics|
  first = true
  uri = "/?t={\"type\":\"intersection\",\"data\":["
  topics.split("|").each do |topic|
    uuid = getUUID(topic)
    if (first)
      uri += "{\"type\":\"intersection\",\"selection\":[\"" + uuid + "\""
      first = false
    else
      uri += ",\"" + uuid + "\""
    end
  end
  uri+= "],\"exclusion\":[]}]}"
  visit uri
end

Soit("la rubrique {string} est visible et sélectionnée") do |topic|
    click_on topic
end
Soit("la liste des rubriques sélectionnées est vide") do
  visit "/"
end

Soit ("l'utilisateur {string} connecté") do |username|
  click_link('Se connecter...')
  find('input[placeholder="nom d\'utilisateur"]').set username
  find("input[placeholder='mot de passe']").set getPassword(username)
  click_on('Se connecter')
  expect(page).to have_content(username)
end

# Events

Quand("un visiteur ouvre la page d'accueil du site") do
  visit "/"
end

Quand("un visiteur ouvre la page d‘accueil d‘un site dont l‘adresse commence par {string}") do |portfolio|
  visit "/"
end

Quand("on sélectionne la rubrique {string}") do |topic|
  click_on topic
end

Quand("on choisit la rubrique {string} contenue dans la rubrique {string}") do |string, string2|
  click_on string
  click_on string2
end

Quand("on choisit l'item {string}") do |item|
  click_on item
end

def in_modal()
  f = find('.modal-content')
end

Quand("on créé une copie du portfolio appelée {string} avec le corpus {string} et le point de vue {string}") do |name, corpus, viewpoint|
  case name
  when "undefined"
    pending "alternate configuration"
  else
    click_button('alice')
    click_link('Dupliquer')
    in_modal.fill_in('copyName', with: name)
    in_modal.check(corpus)
    in_modal.check(viewpoint)
    in_modal.click_on('Valider')
    in_modal.click_on('Confirmer')
Quand("l'utilisateur exclue la rubrique {string}") do |topic|
  click_on topic
end

Quand ("l'utilisateur crée un item {string} dans le corpus {string}") do |name, corpus|
  find_button(:id => corpus).click
  expect(page).to have_content("undefined")
  find_by_id("new-attribute").set "name:#{name}"
  find_button(class: ['btn', 'btn-sm', 'ValidateButton']).click
end

Quand ("l'utilisateur sélectionne {string} entre la rubrique {string} et la rubrique {string}") do |union, topic1, topic2|
  within('.Status') do
    find(:xpath, "//span[contains(text(), topic1)]/following-sibling::button", text: union, match: :first).click
  end
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

Alors("il doit y avoir au moins {int} items sélectionnés décrits par {string}") do |itemsNb, topic|
  expect(find_button(topic).sibling('.badge').text.scan(/\d+/)[0].to_i).to be >= itemsNb
end

Alors("les rubriques surlignées sont au nombre de {int}") do |topicNb|
  expect(page).to have_selector('.Selected', :count => topicNb)
end

Alors ("l'item {string} est affiché") do |item|
  expect(page).to have_content item
end

Alors ("l'item {string} n'est pas affiché") do |item|
  expect(page).not_to have_content item
end
