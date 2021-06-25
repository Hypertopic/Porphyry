Quand("on sélectionne la rubrique {string}") do |topic|
  click_on topic
end

Quand("on choisit l'attribut {string}") do |attribute|
  click_on attribute
end

Quand ("l'utilisateur crée un item {string} dans le corpus {string}") do |name, corpus|
  click_on corpus
  expect(page).to have_content("undefined")
  fill_in placeholder: 'Ajouter un attribut et une valeur...', with: "name:#{name}"
  click_on 'validateButton-undefined'
end

Quand ("l'utilisateur change l'opérateur entre la rubrique {string} et la rubrique {string}") do |topic1, topic2|
  within('.Status') do
    find(:xpath, "//span[contains(., #{topic1})]/following-sibling::button", match: :first).click
  end
end

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

Quand("l'utilisateur indique {string} comme valeur de l'attribut {string}") do |value, attribute|
  within '.Attributes' do
    fill_in placeholder: 'Ajouter un attribut et une valeur...', with: "#{attribute}:#{value}"
    click_on class: 'ValidateButton' 
  end
end

Quand("l'utilisateur indique {string} comme nouvelle rubrique du point de vue {string}") do |topic, viewpoint|
  within '.Viewpoint', text: viewpoint do
    fill_in placeholder: 'Ajouter une rubrique...', with: topic
    click_on class: 'ValidateButton'
    click_on class: 'ValidateButton'
  end
end

Quand("l'utilisateur indique {string} pour la rubrique {string} du point de vue {string}") do |pattern, topic, viewpoint|
  within '.Viewpoint', text: viewpoint do
    find('input').send_keys pattern
    click_link(topic, href: nil)
    click_on class: 'ValidateButton'
  end
end

Quand("l'utilisateur recherche {string} puis choisit {string}") do |pattern, attribute|
  find('input[type="search"]').send_keys pattern
  click_link(attribute, href: nil)
end

Quand("l'utilisateur choisit l'item {string} dans le bloc Items ayant le même nom") do |item|
  within '.Item' do
    click_on item
  end
end

Alors("l'item {string} est au dessus du plan") do |item|
  within('.Spatial') do
    find(:xpath, "//div[@class='item' and contains(., '#{item}')]/../following-sibling::div/div[@id='plan']")
  end
end

Alors("l'item {string} est au dessus de l'item {string}") do |itemHaut, itemBas|
  within('.Spatial') do
    find(:xpath, "//div[@class='item' and contains(., '#{itemHaut}')]/../following-sibling::div/div[contains(.,'#{itemBas}')]")
  end
end

Alors("l'item {string} est à droite du plan") do |item|
  within('.Spatial') do
    find(:xpath, "//div[@id='plan']/following-sibling::div[@class='item' and contains(., '#{item}')]")
  end
end

Alors("l'item {string} est à droite de l'item {string}") do |itemDroite, itemGauche|
  within('.Spatial') do
    find(:xpath, "//div[@class='item' and contains(., '#{itemGauche}')]/following-sibling::div[@class='item' and contains(., '#{itemDroite}')]")
  end
end

Alors("l'item {string} est à gauche du plan") do |item|
  within('.Spatial') do
    find(:xpath, "//div[@id='plan']/preceding-sibling::div[@class='item' and contains(., '#{item}')]")
  end
end