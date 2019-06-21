require 'capybara/cucumber'
require 'capybara/cuprite'


Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
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
    when "Figuration du donateur"
      uuid = "fe94b684b6a42c4889c1e0d7458b9526"
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

Soit("la rubrique {string} contenue dans la rubrique {string}") do |topic1, topic2|
  # On the remote servers
end

Soit("le fragment {string} contenu dans la rubrique {string}") do |highlight, topic|
  # On the remote servers
end

Soit("{int} items décrits par {string} et {string}") do |itemsNb, topic1, topic2|
  # On the remote servers
end

Soit("la rubrique {string} rattachée au point de vue {string}") do |topic, viewpoint|
  # On the remote servers
end

Soit("les rubriques affichées en liste") do
    visit "/"
    expect(page).to have_css('.Topics ul')
end

Soit("l'item {string} rattaché à la rubrique {string}") do |item, corpus|
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
  find_link(topic).sibling('.oi').click
end


Soit("{string} la valeur de l'attribut {string} de l'item {string}") do |value, attribute ,item|
   # On the remote servers
end

Soit("les rubriques {string} sont sélectionnées") do |topics|
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

Soit("la liste des rubriques sélectionnées est vide") do
  # on the remote servers
end

Soit("la vue nuage de mot est séléctionnée") do
  find('.react-switch-bg').click
end

Soit("l'item {string} rattaché au corpus {string}") do |string, string2|
   # On the remote servers
end

Soit("le point de vue {string} rattaché à l'item {string}") do |string, string2|
   # On the remote servers
end

Soit("le fragment {string} rattaché à la rubrique {string}") do |string, string2|
   # On the remote servers
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

Quand("on choisit l'item {string}") do |item|
  click_on item
end

Quand("un visiteur change de vue vers nuage de mots") do
  find('.react-switch-bg').click
  expect(page).to have_css('.tag-cloud')
end

Quand("un visiteur séléctionne la rubrique {string}") do |topic1|
   click_link(topic1, :text => topic1 )
end

Quand("l'item {string} est selectionné") do |item|
   find('.item', text: item).click
   expect(page).to have_selector('.textSelected')
end

# Outcomes

Alors("le titre affiché est {string}") do |portfolio|
  expect(page).to have_content "mpolki"
end

Alors("un des points de vue affichés est {string}") do |viewpoint|
  expect(page).to have_content viewpoint
end

Alors("un des corpus affichés est {string}") do |corpus|
  expect(page).to have_content corpus
end

Alors("il doit y avoir au moins {int} items sélectionnés décrits par {string}") do |itemsNb, topic|
  expect(find_link(topic).sibling('.badge').text.scan(/\d+/)[0].to_i).to be >= itemsNb
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


Alors("un des points de vue affichés est {string} au portfolio {string}") do |viewpoint, string|
  visit "/"
  expect(page).to have_content viewpoint
end

Alors("la rubrique {string} est plus grosse que {string}") do |topic1, topic2|
    find('a span',text: "Action", match: :prefer_exact).click
    # page.save_screenshot("test.png")
    node1 = find('a span',text: topic1, match: :prefer_exact).style('font-size')['font-size'].split('px')[0].to_i
    node2 = find('a span',text: topic2, match: :prefer_exact).style('font-size')['font-size'].split('px')[0].to_i
    expect(node1).to be > node2
end

Alors("la rubrique {string} est surlignée") do |topic|
  expect(find('a span',text: topic, match: :prefer_exact).style('background-color')['background-color']).to eq('rgba(238, 170, 51, 0.6)')
end

Alors("la rubrique {string} est affichée") do |category|
   expect(page).to have_content category
end

Alors("le fragment {string} est affiché") do |fragment|
   expect(page).to have_content fragment
end

Alors("le lien vers le texte {string} associé au fragment {string} est affiché") do |text, fragment|
   expect(find('p', text: text)).to have_selector('a')
end

Alors("il doit y avoir au moins {int} items affichés") do |int|
   expect(page).to have_selector('.Items .item', count: int)
end

Alors("l'item {string} est décrit par une date") do |item|
   node = find('.Items .item .name', text: item)
   parent = node.find(:xpath, '..')
   expect(parent).to have_selector('.date')
end

Alors("l'item {string} est décrit par un auteur") do |item|
   node = find('.Items .item .name', text: item)
   parent = node.find(:xpath, '..')
   expect(parent).to have_selector('.author')
end