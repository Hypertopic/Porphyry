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

Soit("l'utilisateur est connecté") do
  click_on 'Se connecter...'
  fill_in placeholder: "nom d'utilisateur", with: 'alice'
  fill_in placeholder: 'mot de passe', with: 'whiterabbit'
  click_on 'Se connecter'
  expect(page).to have_content 'alice'
end

Soit("{string} l'item affiché") do |item|
  visit getURI(item)
end

Soit("un item en cours de création") do
  visit '/item/Vitraux - Bénel/' + getUUID('')
end

Soit("l'attribut {string} a pour valeur {string}") do |attribute, value|
  expect(page).to have_content value
  expect(page).to have_content attribute
end

Soit("la langue du navigateur est {string}") do |language|
  page.driver.add_headers("Accept-Language" => language)
end


Soit("{string} les rubriques sélectionnées négativement") do |topics|
   pending
  visit '/'
  topics.split('|').each do |topic|
     click_on topic
     click_on topic
  end
end