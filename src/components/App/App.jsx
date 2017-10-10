import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Portfolio from '../Portfolio/Portfolio.jsx';
import Item from '../Item/Item.jsx';

class App extends React.Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/item/:corpus/:item" component={Item} />
          <Route path="/" component={Portfolio} />
        </Switch>
      </Router>
    )
  }

}

export default App;
