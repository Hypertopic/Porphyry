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

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/item/:corpus/:item" component={Item} />
      <Route path="/viewpoint/:id" component={Outliner} />
      <Route path="/" component={Portfolio} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
