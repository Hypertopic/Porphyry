import React, { Component } from 'react';
import { t } from '@lingui/macro';
import { i18n } from '../../index.js';

class Button extends Component {
  constructor() {
    super();
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  render() {
    let union = (this.props.clause.type === 'union');
    return (<button className="badge badge-pill badge-secondary border-0 m-1 align-middle"
      title={union ? i18n._(t`Ou`) : i18n._(t`Et`)}
      onClick={this.handleChangeState}>  {union ? i18n._(t`Ou`) : i18n._(t`Et`)}</button>
    );
  }

  handleChangeState() {
    this.props._changeUnionState(this.props.clause);
  }
}

export default Button;
