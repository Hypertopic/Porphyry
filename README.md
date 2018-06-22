PORPHYRY – Corpus analyses confrontation
========================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Porphyry>

Notice
------

Porphyry is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

How to use the Facebook comment function
-------------------------

We have a Facebook comment for each items, you can setup your own Appid according to the following steps.

* Step 1: Get your own Appid from facebook

  1. Goto [Facebook for developpers](https://developers.facebook.com/?locale=en_US) and login to your account.
  2. Click **My Apps** in the top right corner and click **Add New App** to add your own facebook app.
  3. Fill in the **Display Name**, give your app a name.
  4. Click **Creat App ID**.
  5. At the top of the new page you will see your Appid like **APP ID: 3798490625XXXXX**, click it and it will be copied automatically.
-------------------------
* Step 2: Add your Appid into the config file

  1. The config file ```/src/config/config.json``` is like this.

      ```json
      {
        "user": "vitraux",
        "services": [
          "http://argos2.hypertopic.org",
          "http://steatite.hypertopic.org"
        ],
        "customization": {
          "vitraux": {
            "facebookComment":{
              "enable":false,
              "Appid":"YOUR_APPID_HERE"
            }
          }
        }
      }
      ```
  2. If you want to enable this function, set the ```enable``` in ```facebookComment``` from ```false``` to ```true```.
  3. When you set the ```enable``` to ```true```, you can now paste your Appid get in **Step 1** to ```Appid``` in ```facebookComment```. Here is an example of the last version of your ```config.json```.
      ```json
      {
        "user": "vitraux",
        "services": [
          "http://argos2.hypertopic.org",
          "http://steatite.hypertopic.org"
        ],
        "customization": {
          "vitraux": {
            "facebookComment":{
              "enable":true,
              "Appid":"3798490625XXXXX"
            }
          }
        }
      }
      ```
  5. Done, now you can see the Facebook comment module in each item page.

Installation requirements
-------------------------

* Git client
* Node.js

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
