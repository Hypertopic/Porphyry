Quand("on sélectionne la rubrique {string}") do |topic|
  click_on topic
end

Quand("on change en sélection négative la sélection de la rubrique {string}") do |topic|
  click_on topic
end

Quand("on désélectionne la rubrique {string}") do |topic|
  click_on topic
  click_on topic
end

Quand("on choisit l'attribut {string}") do |attribute|
  click_on attribute
end

Quand ("l'utilisateur crée un item {string} dans le corpus {string}") do |name, corpus|
  click_on corpus
  expect(page).to have_content("undefined")
  within '.Attributes' do
    fill_in placeholder: 'Ajouter un attribut et une valeur...', with: "name:#{name}"
    click_on class: 'ValidateButton'
  end
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

Quand("l'utilisateur choisit l'item {string} parmi les items affichés") do |item|
  within '.Items' do
    click_on item
  end
end

Quand("{string} souhaite s'enregistrer comme contributeur en tant que {string} avec le mot de passe {string}") do |mail, login, password|
  click_on "S'inscrire..."
  expect(page).to have_content("Formulaire d'inscription")
  range = [*'0'..'9',*'A'..'F']
  hash = Array.new(36){ range.sample }.join
  fill_in "email", with: hash + mail
  fill_in "pseudo", with: login + hash
  fill_in "password", with: password
  click_on "Inscription"
end

Quand("l'utilisateur crée la rubrique {string} à la racine du point de vue") do |topic|
  find('.node').click.send_keys(:return)
  fill_in class:'editedNode', with: topic
end
