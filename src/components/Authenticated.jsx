import React, { Component } from 'react';
import AccountCreator from './portfolioPage/AccountCreator';

function makeID() {
  var id = '';
  for (var i = 0; i < 6; i++) {
    id += Math.random().toString(15).substring(10);
  }
  id = id.slice(0, 32);
  return id;
}

class Authenticated extends Component {

  constructor(props) {
    super(props);
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
        <a href="#login" onClick={this.handleAsk}>Se connecter...</a>
        <br/>
        <AccountCreator />
      </div>
    );
  }

  requestSession(options) {
    return this.props.conf.then(x => {
      options = options || {};
      options.credentials = 'include';
      return fetch(x.services[0] + '/_session',  options)
    });
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
    this.requestSession()
      .then(x => x.json())
      .then(x => this.setState({user: x.name || x.userCtx.name}))
      .catch(() => this.setState({user: ''}));
  }

  _openSession() {
    let user = this.login.value;
    this.requestSession({
      method:'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:`name=${user}&password=${this.password.value}`
    })
      .then(x => {
        if (!x.ok) throw new Error('Bad credentials!');
        this.setState({user})
      })
      .catch(() => this.setState({user: ''}));
  }

  _closeSession() {
    this.requestSession({method:'DELETE'})
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
