def getUUID(name)
  uuid = nil
  case name
    when "Abram/Abraham"
      uuid = "f1520229979b11428f94a004f880c022"
    when "XIXe s."
      uuid = "addd464d06159c4eb0b9666cffb2042c"
    when "1518"
      uuid = "fed64e22e60941409ad45c167fc396b8"
    when "vers 1520"
      uuid = "e01a7cb572461a43a22aa8f771235cb6"
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

Soit("le point de vue {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("le corpus {string} rattaché au portfolio {string}") do |viewpoint, portfolio|
  # On the remote servers
end

Soit("l'item {string} rattaché à la rubrique {string}") do |item, topic|
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

Soit("{string} le portfolio ouvert") do |portfolio|
  visit "/"
end

Soit("{string} une des rubriques développées") do |topic|
  find_button(topic).sibling('.oi').click
end

Soit("{string} un des items affichés") do |itemName|
  expect(page).to have_content itemName 
end

Soit("{string} un des items cachés") do |itemName|
  expect(page).not_to have_content itemName 
end

Soit("{string} les rubriques sélectionnées") do |topics|
  topic_format = '{"type":"intersection","selection":%s,"exclusion":[]}'
  query_format = '{"type":"intersection","data":[%s]}'
  selection = topics.split('|').map {|topic| getUUID(topic)}
  json = topic_format % [*selection.shift].to_s
  if selection.any?
    json += ',' + topic_format % selection.to_s
  end
  uri = '/?t=' + query_format % json
  visit uri
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

Quand ("l'utilisateur crée un item {string} dans le corpus {string}") do |name, corpus|
  find_button(:id => corpus).click
  expect(page).to have_content("undefined")
  find_by_id("new-attribute").set "name:#{name}"
  find_button(class: ['btn', 'btn-sm', 'ValidateButton']).click
end

Quand ("l'utilisateur sélectionne {string} entre la rubrique {string} et la rubrique {string}") do |union, topic1, topic2|
  within('.Status') do
    find(:xpath, "//span[contains(., #{topic1})]/following-sibling::button", text: union, match: :first).click
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

Alors("la rubrique {string} est sélectionnée") do |topic|
  expect(find(".TopicTag")).to have_content(topic)
end
