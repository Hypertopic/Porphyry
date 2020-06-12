import React from 'react';
import { withRouter } from 'react-router';
import memoize from 'memoize-one';
import {Topics, Items} from '../../model.js';
import InputWithSuggestions from '../InputWithSuggestions.jsx';

class SearchBar extends React.Component {

  state = {pattern: ''};

  candidates() {
    return this.topicsCandidates(this.props.viewpoints).concat(this.attributesCandidates(this.props.items));
  }

  topicsCandidates = memoize(
    (viewpoints) => new Topics(
      Object.fromEntries(
        viewpoints.map(Object.entries)
          .reduce((x, y) => [...x, ...y], [])
          .filter(x => !(['name', 'id', 'upper', 'user'].includes(x[0])))
      )
    ).getAllPaths()
      .map(x => ({id: x.id, name: x.name, type: 'topic'}))
  );

  attributesCandidates = memoize(
    (items) => new Items(
      items
    ).getAttributes()
      .map(([key, value]) => key.concat(' : ', value))
      .map(x => ({id: x, name: x, type: 'attribute'}))
  );

  handleChange = (event) => {
    this.setState({pattern: event.target.value});
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    this.setState({pattern: ''});
    this.props.history.push('/?t=' + JSON.stringify({
      type: 'intersection',
      data: [{
        type: 'intersection',
        selection: [suggestion.id],
        exclusion: []
      }]
    }));
  };

  render() {
    const inputProps = {
      placeholder: 'Rechercher...',
      value: this.state.pattern,
      className: 'form-control',
      type: 'search',
      onChange: this.handleChange
    };
    return (
      <InputWithSuggestions candidates={this.candidates()}
        onSuggestionSelected={this.handleSuggestionSelected}
        inputProps={inputProps}
        id="search"
      />
    );
  }

}

export default withRouter(SearchBar);
