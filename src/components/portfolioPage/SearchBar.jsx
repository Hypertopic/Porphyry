import React from 'react';
import { withRouter } from 'react-router';
import memoize from 'memoize-one';
import {Topics, Items} from '../../model.js';
import InputWithSuggestions from '../InputWithSuggestions.jsx';
import { t } from '@lingui/macro';
import Selection from '../../Selection.js';

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

  /**
   * On suggestion selected, toggle search selection.
   *
   * @param {object} selection Selection object
   * @param {object} selection.suggestion Suggestion selected
   */
  handleSuggestionSelected = (_, { suggestion }) => {
    this.setState({pattern: ''});
    const selection = Selection.fromURI();
    if (suggestion.id.includes('corpus')) {
      selection.addCorpus(suggestion.id);
    } else {
      selection.addTopic(suggestion.id);
    }
    this.props.history.push(selection.toURI());
  };

  render() {
    const inputProps = {
      placeholder: t`Rechercher...`,
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
