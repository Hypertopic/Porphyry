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

Soit("{string} l'item affiché") do |item|
  visit getURI(item)
end

Soit("un item en cours de création") do
  visit '/item/Vitraux - Bénel/' + getUUID('')
end
