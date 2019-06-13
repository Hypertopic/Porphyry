import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import conf from '../../config/config.json';

class Header extends Component {
  constructor() {
    super();
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
  }

  render() {
    return (
      <header className="row align-items-center">
        <div className="col-lg-2 col-md-3 d-none d-md-block logo"></div>
        <div className="col-lg-2 col-md-3 col-sm-4">
          <input className="form-control" type="text" placeholder={"SearchPlaceHolder".t()}/>
        </div>
        <h1 className="text-center col-lg-8 col-md-6 col-sm-8"><Link to="/">{this.user}</Link></h1>
      </header>
    );
  }
}

export default Header;