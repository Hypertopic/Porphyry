import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

function makeID() {
  var id = '';
  for (var i = 0; i < 6; i++) {
    id += Math.random().toString(15).substring(10);
  }
  id = id.slice(0, 32);
  return id;
}

class AccountCreator extends Component {
  render() {
    return (<div className="text-center">
      <button className="btn btn-light creationButton" onClick={_ => this._goToAccountCreationPage()}>
        Creation d'un compte
      </button>
    </div>);
  }

  _goToAccountCreationPage() {
    this.props.history.push('/creationaccount/' + makeID());
  }
}

export default withRouter(AccountCreator);