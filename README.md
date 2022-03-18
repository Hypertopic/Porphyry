PORPHYRY – Corpus analyses confrontation
========================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Porphyry>

## How to test the development version

### Requirements:

* `git`
* `curl`
* `wget`
* `node` and `npm`
* `docker` and `docker-compose`

### Install and start backend with test data

```shell
wget -qO- "https://github.com/Hypertopic/Argos/archive/v4.tar.gz" | tar xvz
cd Argos-4
docker-compose up -d
cd ..
```

Argos is now available at <http://localhost/>

### Create test user

```shell
curl --silent -X PUT localhost:5984/_users
curl --silent -X PUT localhost:5984/_users/org.couchdb.user:alice -H 'Accept:application/json' -H 'Content-Type:application/json' -d '{"name":"alice", "password":"whiterabbit", "roles":[], "type":"user"}'
```

### Install and start frontend

```shell
git clone https://github.com/Hypertopic/Porphyry.git
cd Porphyry
npm install
npm start
```
Porphyry is now available at <http://localhost:3000/>
Please note that the terminal is devoted to the process until it is canceled.

### Install test tools

Add this function to your profile:

```shell
function cucumber() {
  (docker run --rm -v "$(pwd)":/app --tty --net="host" --env APP_HOST="http://host.docker.internal:3000" benel/cucumber-capybara "$@")
}
```

Type the following command:

```shell
cucumber --help
```

### Run tests

From the `Porphyry` folder:

```shell
cucumber --fail-fast --quiet
```

## How to enable plugins

### Enable comments

  1. [Sign up to Disqus](https://disqus.com/profile/signup/),
  2. Choose `Install Disqus on my site`,
  3. Set your Website data and **create site**. Remember its `short name`.
  4. Edit `public/config.yml` and paste the short name as the value of `disqus` setting.

### Enable world map

  1. Sign up to [GoogleMaps](https://console.cloud.google.com/google/maps-apis/overview),
  2. Create an API key to be used with geocoding and dynamic map services
  3. Edit `public/config.yml` and paste the API key as the value of `map/key` setting,
  4. If necessary, switch geocoding API URI from GoogleMaps to [GeoXene](https://github.com/Hypertopic/GeoXEne).
  5. If necessary, add layers (`vases` is here the ID of the portfolio):

```yaml
  portfolio:
    vases:
      layers:
        - uri: https://steatite.utt.fr/picture/405e66c63060b595c02e6590a8f6abbda104cb03
          bounds:
            south: 37.977910
            west: 23.718200
            north: 37.978780
            east: 23.719010
        - uri: https://steatite.utt.fr/picture/78e81db6ee77decd3e40cf3124c04a6aaaaa2fc4
          bounds:
            south: 37.97862453543905
            west: 23.716649743986387
            north: 37.978755
            east: 23.716789
```

### Enable building maps

Edit `public/config.yml` and add:

```yaml
portfolio:
  vitraux:
    visitMap: true
```
where `vitraux` is the ID of your portfolio.

Please note that enabling building maps breaks a few tests (in their current version).
