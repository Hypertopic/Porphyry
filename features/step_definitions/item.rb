require 'capybara/cucumber'
require 'capybara/cuprite'

Capybara.run_server = false
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite
Capybara.app_host = "http://localhost:3000"
Capybara.default_max_wait_time = 10

# Conditions

Soit("{string} l'item affiché") do |item|
  click_on item
end

Soit("le champ {string} du point de vue {string} rempli avec {string}") do |field, viewpoint, text|
  expect(
    find(
      :xpath,
      %(//h3[contains(text(), "#{viewpoint}")]/following-sibling::div//input)
    ).value
  ).to eq text
end

Soit("les suggestions {string}, {string} et {string} affichées pour le champ {string} du point de vue {string}") do |suggestion1, suggestion2, suggestion3, field, viewpoint|
  [suggestion1, suggestion2, suggestion3].each do |suggestion|
    expect(page).to have_xpath(
      %(//h3[contains(text(), "#{viewpoint}")]/following-sibling::div//a[contains(text(), "#{suggestion}")])
    )
  end
end

Soit("le bouton de validation du champ {string} du point de vue {string} activé") do |field, viewpoint|
  # Only enabled elements are considered by `have_xpath()`, so a disabled button would fail the test
  expect(page).to have_xpath(%(//*[@id="validateButton-#{viewpoint}"]))
end

# Events

Quand("on choisit la rubrique {string}") do |topic|
  click_on topic
end

Quand("on entre {string} dans le champ {string} du point de vue {string}") do |text, field, viewpoint|
  find(
    :xpath,
    %(//h3[contains(text(), "#{viewpoint}")]/following-sibling::div//input)
  ).set(text)
end

Quand("on clique sur le bouton de validation") do
  find(:xpath, %(//*[@id="validateButton-Histoire de l'art"])).click
end

Quand("on sélectionne {string} dans le champ {string} du point de vue {string}") do |text, field, viewpoint|
  find(
    :xpath,
    %(//h3[contains(text(), "#{viewpoint}")]/following-sibling::div//a[contains(text(), "#{text}")])
  ).click
end

# Outcomes

Alors("le titre de l'item affiché est {string}") do |item|
  expect(find(".Subject h2")).to have_content(item)
end

Alors("la valeur de l'attribut {string} est {string}") do |attribute, value|
  expect(page).to have_content(value)
  expect(page).to have_content(attribute)
end

Alors("une des rubriques de l'item est {string}") do |topic|
  expect(page).to have_content(topic)
end

Alors("les suggestions {string}, {string} et {string} s'affichent pour le champ {string} du point de vue {string}") do |suggestion1, suggestion2, suggestion3, field, viewpoint|
  [suggestion1, suggestion2, suggestion3].each do |suggestion|
    expect(page).to have_xpath(
      %(//h3[contains(text(), "#{viewpoint}")]/following-sibling::div//a[contains(text(), "#{suggestion}")])
    )
  end
end

Alors("le champ {string} du point de vue {string} est rempli avec {string}") do |field, viewpoint, text|
  expect(
    find(
      :xpath,
      %(//h3[contains(text(), "#{viewpoint}")]/following-sibling::div//input)
    ).value
  ).to eq text
end

Alors("le bouton de validation du champ {string} du point de vue {string} est activé") do |field, viewpoint|
  # Only enabled elements are considered by `have_xpath()`, so a disabled button would fail the test
  expect(page).to have_xpath(%(//*[@id="validateButton-#{viewpoint}"]))
end

Alors("la rubrique {string} est ajoutée à l'item {string}") do |topic, item|
  pending "write access on the server"
end
