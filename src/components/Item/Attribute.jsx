import React from 'react';

class Attribute extends React.Component {

  constructor() {
    super();
    this.state = {
      editedValue: ''
    };
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({edit: false});
    }
    if (event.key === 'Enter') {
      this.submitValue(event);
    }
  };

  handleChange = (e) => {
    this.setState({editedValue: e.target.value});
  };

  setEdit = (e) => {
    this.setState({
      edit: true,
      editedValue: this.props.value
    });
  }

  submitValue = (e) => {
    this.props.setAttribute(this.props.myKey, this.state.editedValue).then(
      _ => this.setState({edit: false})
    );
  }

  getButtons = () => {
    if (!this.state.edit) return (
      <div className="buttons">
        <button onClick={this.setEdit} className="btn btn-xs EditButton">
          <span className="oi oi-pencil"> </span>
        </button>
        <button className="btn btn-xs DeleteButton"
          onClick={this.props.deleteAttribute.bind(this, this.props.myKey)}>
          <span className="oi oi-x"> </span>
        </button>
      </div>
    );
    return (
      <button type="button" className="btn btn-sm ValidateButton btn"
        onClick={this.submitValue}
        disabled={!this.state.editedValue}
        id={`validateButton-${this.props.myKey}`}>
        <span className="oi oi-check"> </span>
      </button>
    );
  }

  getAttributeValue = () => {
    if (!this.state.edit) return (
      <div className="Value">
        {this.props.value}
      </div>
    );
    return (
      <div className="Value edit">
        <input value={this.state.editedValue} placeholder="valeur"
          autoFocus onChange={this.handleChange} onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }

  render() {
    let buttons = this.getButtons();
    let attributeValue = this.getAttributeValue();
    return (
      <div className="Attribute">
        <div className="Key">
          {this.props.myKey}
        </div>
        {attributeValue}
        {buttons}
      </div>
    );
  }
}

export default Attribute;
