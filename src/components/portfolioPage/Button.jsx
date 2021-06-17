import React, { Component } from 'react';
import { t } from '@lingui/macro';

class Button extends Component {
  constructor() {
    super();
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  render() {
    let union = (this.props.clause.type === 'union');
    return (<button className="badge badge-pill badge-secondary border-0 m-1 align-middle"
      title={union ? t`Ou` : t`Et`}
      onClick={this.handleChangeState}>  {union ? t`Ou` : t`Et`}</button>
    );
  }

  handleChangeState() {
    this.props._changeUnionState(this.props.clause);
  }
}

export default Button;
