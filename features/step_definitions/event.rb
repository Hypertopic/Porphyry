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

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

Quand("on ajoute un attribut {string} et la valeur {string}") do |attribut, value|
  find_button('Ajouter un attribut').click
    fill_in "#key", with: attribut

    fill_in "#value", with: value

  find_button('Valider').click
end

