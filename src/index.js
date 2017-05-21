import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Portfolio from './Portfolio';
import Item from './Item';
import './index.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/item/:corpus/:item" component={Item} />
      <Route path="/" component={Portfolio} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
