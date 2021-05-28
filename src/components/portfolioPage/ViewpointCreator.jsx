import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';

function makeID() {
  var id = '';
  for (var i = 0; i < 6; i++) {
    id += Math.random().toString(15).substring(10);
  }
  id = id.slice(0, 32);
  return id;
}

class ViewpointCreator extends Component {
  render() {
    return (<div className="text-center">
      <button className="btn btn-light creationButton" onClick={_ => this._goToNewViewpoint()}>
        <Trans>Nouveau point de vue</Trans>
      </button>
    </div>);
  }

  _goToNewViewpoint() {
    this.props.history.push('/viewpoint/' + makeID());
  }
}

export default withRouter(ViewpointCreator);
