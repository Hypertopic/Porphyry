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

  3. Launch Porphyry with appropriate settings:

  ```
  docker run -p 3000:80 -v "$(pwd)"/conf/porphyry.yml:/usr/share/nginx/html/config.yml benel/porphyry
  ```

  Porphyry is now available at <http://localhost:3000/>

* Enable comments

  1. [Sign up to Disqus](https://disqus.com/profile/signup/),
  2. Choose `Install Disqus on my site`,
  3. Set your Website data and **create site**. Remember its `short name`.
  4. Edit `conf/porphyry.yml` and paste the short name as the value of `disqus` setting.
