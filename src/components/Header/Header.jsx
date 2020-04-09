import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {user: ''};
    props.conf.then(x => this.setState({user: x.user}));
  }

  render() {
    return (
      <header className="row align-items-center">
        <div className="col-lg-2 col-md-3 d-none d-md-block logo"></div>
        <h1 className="text-center col-lg-8 col-md-6 col-sm-8"><Link to="/">{this.state.user}</Link></h1>
      </header>
    );
  }

}

export default Header;
