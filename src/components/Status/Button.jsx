import React, { Component } from 'react';

class Button extends Component {
  constructor() {
    super();
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  render() {
    let union = (this.props.topics.type === 'union');
    return (<button className= {"badge badge-pill badge-secondary border-0 m-1 align-middle"}
      title={union? "Ou":"Et"}
      onClick={this.handleChangeState}>  {union? "Ou":"Et"}</button>
    );
  }

  handleChangeState() {
    this.props._changeUnionState(this.props.topics);
  }
}

export default Button
