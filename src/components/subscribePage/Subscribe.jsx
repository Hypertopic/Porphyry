import React, {Component} from 'react';
import conf from '../../config.js';

import Header from '../Header.jsx';

class Subscribe extends Component {
  constructor() {
    super();
    this.state = {
      pseudo: '',
      email: '',
      password: '',
      seePassword: false
    };
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  requestSession = (options) => {
    console.log(conf);
    return conf.then(x => {
      options = options || {};
      return fetch(x.services[0] + '/_users', options);
    });
  };
  handleConnection = () => {
    this.requestSession({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        '_id': `org.couchdb.user:${this.state.pseudo}`,
        'name': this.state.pseudo,
        'type': 'user',
        'roles': [],
        'email': this.state.email,
        'password': this.state.password
      })
    })
      .then(x => {
        if (!x.ok) throw new Error('Bad credentials!');
        // METTRE ICI LA REDIRECTION + AUTHENTIFICATION
      })
      .catch(() => this.setState({user: ''}));
  };

  render() {
    return (
      <div className="App container-fluid">
        <Header conf={conf}/>
        <div className="container">
          <div className="row">
            <div id="subscribeCard">
              <div className="col-12" id="headerSubscribeCard">
                <h2>Formulaire d'inscription</h2>
              </div>
              <div className="col-12" id="bodySubscribeCard">
                <form>
                  <div className="form-group">
                    <label htmlFor="pseudo">Pseudonyme</label>
                    <input type="text" className="form-control" id="pseudo" aria-describedby="emailHelp"
                      placeholder="Bob" name="pseudo" onChange={(e) => this.handleChange(e)}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" placeholder="bob@bob.fr" name="email"
                      onChange={(e) => this.handleChange(e)}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type={this.state.seePassword ? 'text' : 'password'} className="form-control" id="password"
                      placeholder="Ep0nge" name="password" onChange={(e) => this.handleChange(e)}/>
                  </div>
                </form>
                <button type="button" className="btn btn-success" onClick={() => this.handleConnection()}>Inscription</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subscribe;
