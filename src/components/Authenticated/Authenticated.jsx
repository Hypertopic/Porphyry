import React, { Component } from 'react';
import conf from '../../config/config.json';

const SESSION_URI = conf.services[0] + '/_session';

class Authenticated extends Component {

  constructor() {
    super();
    this.state = {
      user: '',
      ask: false
    }
    this.handleAsk = this.handleAsk.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  render() {
    if (this.state.user) {
      return (
        <div className="Authenticated"> {this.state.user}
          <a href="#logout" onClick={this.handleLogout}>Se déconnecter</a>
        </div>
      );
    }
    if (this.state.ask) {
      return(
        <form className="Authenticated" onSubmit={this.handleLogin}>
          <input placeholder="nom d'utilisateur" ref={(x) => this.login = x} />
          <input placeholder="mot de passe" ref={(x) => this.password = x} type="password" />
          <input type="submit" value="Se connecter" />
        </form>
      );
    }
    return (
      <div className="Authenticated">
        <a href="#login" onClick={this.handleAsk}>{'Se connecter...'.t()}</a>
      </div>
    );
  }

  handleAsk(e) {
    e.preventDefault();
    this.setState({ask: true});
  }

  handleLogin(e) {
    e.preventDefault();
    this._openSession();
    this.setState({ask: false});
  }

  handleLogout(e) {
    e.preventDefault();
    this._closeSession();
  }

  _fetchSession() {
    fetch(SESSION_URI, {credentials: 'include'})
      .then(x => x.json())
      .then(x => this.setState({user: x.name || x.userCtx.name}))
      .catch(() => this.setState({user: ''}));
  }

  _openSession() {
    let user = this.login.value;
    fetch(SESSION_URI, {
      method:'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:`name=${user}&password=${this.password.value}`,
      credentials:'include'
    })
      .then(x => {
        if (!x.ok) throw new Error('Bad credentials!');
        this.setState({user})
      })
      .catch(() => this.setState({user: ''}));
  }

  _closeSession() {
    fetch(SESSION_URI, {method:'DELETE', credentials:'include'})
      .then(() => this.setState({user: ''}));
  }

  componentDidMount() {
    this._fetchSession();
    this._timer = setInterval(
      () => this._fetchSession(),
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }
}

export default Authenticated;
