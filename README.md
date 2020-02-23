PORPHYRY – Corpus analyses confrontation
========================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Porphyry>


## Requirements

* [Docker Engine](https://docs.docker.com/install/)


## How to use this image

* With data stored on Argos test server

  ```
  docker run -p 3000:80 benel/porphyry
  ```

  Porphyry is now available at <http://localhost:3000/>

* With data stored on your own Argos server

  1. [Install and start Argos server](https://github.com/Hypertopic/Argos/blob/v4/README.md)
  2. Create the following document in [CouchDB administration interface](http://localhost:5984/_utils/#database/argos/_new) (replace values with what you need):

      ```yaml
      {
        "_id": "MY_ITEMS",
        "corpus_name": "My own items",
        "users": ["MY_PORTFOLIO"]
      }
      ```

  3. Create the `_users` database in [CouchDB administration interface](http://localhost:5984/_utils/#/_all_dbs) and then a user (change values as needed):

      ```yaml
      {
        "_id": "org.couchdb.user:alice",
        "name": "alice",
        "password": "wonderland",
        "roles": [],
        "type": "user"
      }
      ```

  4. Create an administrator in [CouchDB administration interface](http://localhost:5984/_utils/#createAdmin/nonode@nohost)

  5. Launch Porphyry with appropriate settings:

  ```
  docker run -p 3000:80 -v "$(pwd)"/conf/porphyry.yml:/usr/share/nginx/html/config.yml benel/porphyry
  ```

  Porphyry is now available at <http://localhost:3000/>
