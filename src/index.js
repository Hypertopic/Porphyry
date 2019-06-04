import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import App from './components/App/App.jsx';
import Languages from 'languages-js';

Languages.init(['en_EN', 'fr_FR'], './languages/', () => {
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
});
