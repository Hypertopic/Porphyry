import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Portfolio from './components/portfolioPage/Portfolio.jsx';
import Item from './components/itemPage/Item.jsx';
import Outliner from './components/viewpointPage/Outliner.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './styles/index.css';
import './styles/App.css';

import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

let providedLocales = {
  en: require('./locales/en/messages.js').messages,
  fr: require('./locales/fr/messages.js').messages
};

let requestedLocales = window.navigator.languages
  .map(x => x.match(/\w{2}/).shift());

let locale = [...requestedLocales, 'en']
  .filter(x => x in providedLocales)
  .shift();

i18n.load(providedLocales);
i18n.activate(locale);

ReactDOM.render(
  <I18nProvider i18n={i18n}>
    <Router>
      <Switch>
        <Route path="/item/:corpus/:item" component={Item} />
        <Route path="/viewpoint/:id" component={Outliner} />
        <Route path="/" component={Portfolio} />
      </Switch>
    </Router>
  </I18nProvider>,
  document.getElementById('root')
);
