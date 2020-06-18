import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '@lingui/macro';
import { i18n } from '../../index.js';

class Attribute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {edited: false};
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({edited: false});
    }
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  };

  handleChange = (event) => {
    this.setState({editedValue: event.target.value});
  };

  handleClickEdit = () => {
    this.setState({
      edited: true,
      editedValue: this.props.value
    });
  }

  handleSubmit = () => {
    this.props.setAttribute(this.props.name, this.state.editedValue);
    this.setState({edited: false});
  }

  handleClickDelete = () => {
    this.props.deleteAttribute(this.props.name);
  }

  render() {
    return (
      <div className="Attribute">
        <div className="Key">
          {this.props.name}
        </div>
        <AttributeValue 
          id = {this.props.id}
          name ={this.props.name}
          value={this.props.value}
          editedValue={this.state.editedValue}
          edited={this.state.edited}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <Buttons name={this.props.name} editedValue={this.state.editedValue}
          edited={this.state.edited}
          onDelete={this.handleClickDelete}
          onEdit={this.handleClickEdit}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

function Buttons(props) {
  if (props.edited) return (
    <button type="button" className="btn btn-sm ValidateButton btn"
      onClick={props.onSubmit}
      disabled={!props.editedValue}
      id={`validateButton-${props.name}`}>
      <span className="oi oi-check"> </span>
    </button>
  );
  return (
    <div className="buttons">
      <button onClick={props.onEdit} className="btn btn-xs EditButton">
        <span className="oi oi-pencil"> </span>
      </button>
      <button className="btn btn-xs DeleteButton"
        onClick={props.onDelete}>
        <span className="oi oi-x"> </span>
      </button>
    </div>
  );
}

function AttributeValue(props) {
  const patt = /\.[a-zA-Z]{3,4}$/;
  if (props.edited) return (
    <div className="Value edit">
      <input value={props.editedValue} placeholder={i18n._(t`valeur`)} autoFocus
        onChange={props.onChange} onKeyDown={props.onKeyDown}
      />
    </div>
  );
  if (props.value && props.value.startsWith('http')) return (
    <a href={props.value} className="Value">
      {props.value}
    </a>
  );
  if (patt.test(props.value)) return (
    <a href={'http://argos2.test.hypertopic.org/'+props.id+"/"+props.value} className="Value">
      {props.value}
    </a>
  );
  return (
    <div className="Value">
      {props.value}
    </a>
  );
  let uri = `../../?t={"type":"intersection","data":[{"type":"intersection","selection":["${props.name} : ${props.value}"],"exclusion":[]}]}`;
  return (
    <Link className="Value" to={uri}> {props.value} </Link>
  );
}

export default Attribute;
