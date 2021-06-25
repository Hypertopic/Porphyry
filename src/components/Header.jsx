import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Authenticated from './Authenticated.jsx';
import Rss from './Rss.jsx';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {user: ''};
    props.conf.then(x => this.setState({user: x.user}));
  }

  render() {
    return (
      <header className="row align-items-center">
        <div className="col-lg-4 d-none d-lg-block logo"></div>
        <h1 className="col-lg-4">
          <Link to="/">{this.state.user}</Link>
        </h1>
        <div className="col-lg-2">
          <Rss/>
        </div>
        <div className="col-lg-2">
          <Authenticated conf={this.props.conf} />
        </div>
      </header>
    );
  }

}

export default Header;

