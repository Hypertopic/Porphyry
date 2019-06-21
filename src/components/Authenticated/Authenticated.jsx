import React, { Component } from 'react';
import conf from '../../config/config.json';
import Duplicator from '../Duplication/Duplicator'
import { Dropdown, DropdownButton, ButtonGroup, Button, Form } from 'react-bootstrap';

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
      if(this.props.portfolio){
        return (
          <div className="Authenticated">
            <DropdownButton variant="secondary" alignRight as={ButtonGroup} title={this.state.user} id="bg-nested-dropdown">
              <Dropdown.Item eventKey="1" onClick={this.handleLogout}>Se déconnecter</Dropdown.Item>
              <Duplicator portfolio={this.props.portfolio} userConnected={this.state.user} viewpoints={this.props.viewpoints} corpora={this.props.corpora}/>
            </DropdownButton>
          </div>
        );
      }

      return (
        <div className="Authenticated">
          <DropdownButton variant="secondary" alignRight as={ButtonGroup} title={this.state.user} id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={this.handleLogout}>Se déconnecter</Dropdown.Item>
          </DropdownButton>
        </div>
      );
    }
    if (this.state.ask) {
      return(
        <Form className="FormConnect" onSubmit={this.handleLogin}>
          <Form.Control type="text" ref={(x) => this.login = x} placeholder="Nom d'utilisateur" />
          <Form.Control type="password" ref={(x) => this.password = x} placeholder="Mot de passe" />
          <Button variant="secondary" type="submit">
            Confirmer
          </Button>
        </Form>
      );
    }
    return (
      <div className="Authenticated">
        <Button href="#login" onClick={this.handleAsk} variant="secondary">Se connecter</Button>
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
      .then(() => { 
        this.setState({user: ''})
    });
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
