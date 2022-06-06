import React, {Component} from 'react';
import conf from '../../config.js';
import Header from '../Header.jsx';
import { Trans } from '@lingui/macro';

class Register extends Component {
  requestSession(options) {
    return conf.then(x => {
      options = options || {};
      options.credentials = 'include';
      return fetch(x.services[0] + '/_session', options);
    });
  }
  requestLogin = (options) => {
    return conf.then(x => {
      return fetch(x.services[0] + '/_users/', options || {});
    });
  };
  handleConnection = () => {
    const regexp = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
    if (regexp.test(this.email.value)) {
      this.requestLogin({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '_id': `org.couchdb.user:${this.pseudo.value}`,
          'name': this.pseudo.value,
          'type': 'user',
          'roles': [],
          'email': this.email.value,
          'password': this.password.value
        })
      })
        .then(x => {
          if (!x.ok) throw new Error('Bad credentials!');
          this._openSession();
        })
        .catch(() => console.error('Register failed !'));
    } else {
      console.error('Incorrect email format !');
    }
  };
  _openSession() {
    this.requestSession({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `name=${this.pseudo.value}&password=${this.password.value}`
    }).then(x => {
      if (!x.ok) throw new Error('Bad credentials!');
      const param = new URLSearchParams(this.props.location.search).get('item');
      this.props.history.push({
        pathname: param ? `/${param}` : '/'
      });
    }).catch((e) => console.error('Openning session failed !'));
  }
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
                    <label htmlFor="pseudo"><Trans>Pseudonyme</Trans></label>
                    <input type="text" className="form-control" id="pseudo" aria-describedby="emailHelp"
                      placeholder="bob" name="pseudo" ref={(x) => this.pseudo = x}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email"><Trans>Adresse email</Trans></label>
                    <input type="email" className="form-control" id="email" placeholder="bob@gmail.com" name="email" ref={(x) => this.email = x}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password"><Trans>Mot de passe</Trans></label>
                    <input type={'password'} className="form-control" id="password"
                      placeholder="Ep0nge" name="password" ref={(x) => this.password = x}/>
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

export default Register;
