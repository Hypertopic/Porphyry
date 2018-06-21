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

class ViewpointCreator extends Component {
  render() {
    return (<div className="text-center">
      <button className="btn btn-light creationButton" onClick={_ => this._goToNewViewpoint()}>
        Nouveau point de vue
      </button>
    </div>);
  }

  _goToNewViewpoint() {
    this.props.history.push('/viewpoint/' + makeID());
  }
}

export default withRouter(ViewpointCreator);
