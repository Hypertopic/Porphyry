import React, { Component } from 'react';
import { Items } from '../../model.js';
import Selection from '../../Selection.js';
import { withRouter } from 'react-router-dom';

class AttributeSearch extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedValue: '',
    };
  }
  render() {
    let attributeValues = this._getValues();
    let options = this._getOptions(attributeValues);
    let handleChange = (e) => {
      const selection = Selection.fromURI();
      if (e.target.value !== '') {
        if (this.state.selectedValue !== '') {
          selection.removeTopic(this.state.selectedValue);
        }
        selection.addTopic(e.target.value);
      } else {
        selection.removeTopic(this.state.selectedValue);
      }
      console.log(selection.toURI());
      this.props.history.push(selection.toURI());
      this.setState({selectedValue: e.target.value});
    };
    return (
      <div className={'AttributesList ' + this.props.name}>
        {this.props.name}
        <select id={this.props.name} onChange={handleChange} className="selectValue">
          <option value="">Choisir</option>
          {options}
        </select>
      </div>
    );
  }

  _getValues() {
    let attributesValues = new Items(this.props.items)
      .getAttributeValues(this.props.name);
    attributesValues = new Set(attributesValues);
    attributesValues = Array.from(attributesValues);
    return attributesValues;
  }

  _getOptions(attributeValues) {
    return attributeValues.map(value => {
      let optVal = this.props.name + ' : ' + value;
      return <option key={optVal} value={optVal}>{value}</option>;
    });
  }

  handleChange(e) {
    e.preventDefault();
    console.log(this.props.query.toURI());
  }

}

export default withRouter(AttributeSearch);
