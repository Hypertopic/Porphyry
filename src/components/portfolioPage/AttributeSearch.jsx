import React, { Component } from 'react';
import { Items } from '../../model.js';
import Selection from '../../Selection.js';
import { withRouter } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import conf from '../../config.js';

class AttributeSearch extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedValue: '',
      slider: [],
      value: [2010, 2021],
      min: 2010,
      max: 2021,
    };
    conf.then(settings => {
      if (settings.portfolio && settings.portfolio[settings.user])
        this.setState({
          slider: settings.portfolio[settings.user].slider || false,
        });
    }).then(valeur => {
      if (this.state.slider.includes(this.props.name)) {

        let dates = new Set();
        this._getValues().forEach(value => {
          dates.add((parseInt(value.substring(0, 4)) || 0));
        });
        this.setState({min: Math.min(...dates)});
        var today = new Date();
        this.setState({max: today.getFullYear()});
        this.setState({value: [this.state.min, this.state.max]});
      }
    }
    );
  }

  render() {
    let attributeValues = this._getValues();
    let options = this._getOptions(attributeValues);
    let handleChange = (e) => {
      const selection = Selection.fromURI();
      console.log(selection.selectionJSON);
      if (!this.state.slider.includes(this.props.name)) {
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
      } else {
        console.log(selection.toURI());

      }
    };

    return (
      <div className={'AttributesList ' + this.props.name}>
        {this.props.name}
        {(this.state.slider.includes(this.props.name))
          ? ' : ' + this.state.value[0] + ' - ' + this.state.value[1]
          : null
        }
        {(this.state.slider.includes(this.props.name)
          ? <div>
            <div>{}</div>
            <div>{}</div>
            <Slider
              range
              min={this.state.min}
              max={this.state.max}
              value={this.state.value}
              count={1}
              onChange={value => {
                this.setState(
                  {
                    value
                  },
                );
                let todelete = [];
                const selection = Selection.fromURI();
                selection.selectionJSON.data.forEach((element) => {
                  if (element.selection[0] && element.selection[0].includes(this.props.name)) {
                    todelete.push(element.selection[0]);
                  }
                  if (element.exclusion[0] && element.exclusion[0].includes(this.props.name)) {
                    todelete.push(element.exclusion[0]);
                  }
                });
                for (const item of todelete) {
                  selection.removeTopic(item);
                }
                let values = this._getValues();
                let valuesParsed = [];
                let realValues = [];

                for (let value of values) {
                  valuesParsed.push(parseInt(value));
                }
                for (let i = this.state.value[0]; i <= this.state.value[1]; i++) {
                  if (valuesParsed.includes(i)) {
                    realValues.push(this.props.name + ' : ' + valuesParsed[valuesParsed.indexOf(i)]);
                  }
                }
                selection.addTopicArray(realValues);
                this.props.history.push(selection.toURI());
              }}
              railStyle={{
                height: 4,
              }}
              handleStyle={{
                height: 10,
                width: 10,
                marginLeft: -5,
                marginTop: -3,
                backgroundColor: 'blue',
                border: 0
              }}
            />
          </div>
          : <select id={this.props.name} onChange={handleChange} className="selectValue">
            <option value="">Choisir</option>
            {options}
          </select>)
        }
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
