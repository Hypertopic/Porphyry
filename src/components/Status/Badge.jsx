import React, { Component } from 'react';

class Badge extends Component {
  constructor() {
    super();
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
  }

  render() {
    return (
      <span className={"badge badge-pill badge-light TopicTag " + (this.props.exclusion? "text-danger": "")}>
        {this.props.name}
        <button className={"badge badge-pill badge-dark oi ml-1 border-0 " + (this.props.exclusion? "oi-plus":"oi-minus")}
          title={this.props.exclusion? "Inclure":"Exclure"}
          onClick={this.handleChangeState}
        > </button>
        <button className="badge badge-pill badge-dark oi oi-x border-0"
          title="Déselectionner"
          onClick={this.handleDeletion}>
        </button>
      </span>
    )
  }

  handleDeletion() {
    this.props._changeItemState(this.props.id, true);
  }
  handleChangeState() {
    this.props._changeItemState(this.props.id, false);
  }
}

export default Badge;
