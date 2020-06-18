import React, { Component } from 'react';
import Header from '../Header';
import conf from '../../config';
import {Link} from 'react-router-dom';

class CreationCompte extends Component{
  constructor(props) {
    super(props);
  }

    render() {
    return(
      <div className="App container-fluid">
        <Header conf={conf} />
        <div className="Status row h5">
          <Link to="/" className="badge badge-pill badge-light TopicTag">
            <span className="badge badge-pill badge-dark oi oi-chevron-left"> </span> Retour à l'accueil
          </Link>
        </div>
        <div>
          <form method="put" onSubmit={this._verifyUser}>
            <div>
              <label>
                Pseudo
                <input type="text" name="login"/>
              </label>
            </div>
            <div>
              <label>
                Adresse email :
                <input type="email" name="email" />
              </label>
            </div>
            <div>
              <label>
                Mot de Passe
                <input type="password" name="password"/>
              </label>
              <label>
                Confirmer Mot de Passe
                <input type="password" name="password_confirm"/>
              </label>
            </div>

            <input type="submit" value="Envoyer" />

          </form>

        </div>
      </div>);
  }

  _verifyUser() {
    let user= this.login.value;
    if (this.password.value === this.password_confirm.value) {
      this.createUser({
        method:'PUT',
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json"
        },
        body:`id=org.couchdb.user:${user}&name=${user}&password=${this.password.value}&roles=[]&type=user`
      })
        .then(x => {
        if (!x.ok) throw new Error('Erreur dans la requête !');
      })
        //.catch(() => throw new Error("Erreur de catch"))
    }
    else {
      throw new Error('Les mots de passe ne correspondent pas !')
    }
  }

  createUser(options) {
    return this.props.conf.then(x => {
      options = options || {};
      options.credentials = 'include';
      return fetch(x.services[0] + '/_users',  options)
    });
  }

}



export default CreationCompte;