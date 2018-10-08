PORPHYRY – Corpus analyses confrontation
========================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Porphyry>

Notice
------

Porphyry is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

Installation requirements
-------------------------

* Git client
* Node.js
* [Argos v4](https://github.com/Hypertopic/Argos) (on a server)

The CouchDB instance thats hosts Argos must be set so that:

```ini
[HTTPD]
enable_cors = true
secure_rewrites = false

[CORS]
origins = http://localhost:3000
methods = GET, PUT, POST, HEAD, DELETE
headers = accept, authorization, content-type, origin, referer, if-match
```

Create user `alice`.

Installation procedure
----------------------

    npm install

Launch in development mode
--------------------------

    npm start

Build for production
--------------------

    npm run build

Tests requirements
------------------

    gem install cucumber rspec capybara selenium-webdriver chromedriver-helper

If it fails on macOS because of `libffi`, it can be fixed by brewing and linking an up-to-date version of the library (at your own risk).

Run tests
---------

Once application is launched in development mode:

    npm run test
