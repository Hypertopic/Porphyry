import React from 'react';
import { withRouter } from 'react-router';
import memoize from 'memoize-one';
import {Topics, Items} from '../../model.js';
import InputWithSuggestions from '../InputWithSuggestions.jsx';

class SearchBar extends React.Component {

  state = {pattern: ''};

  candidates = memoize(
      (viewpoints, items) => {

          let attributesArray = []

          new Items(items).getAttributes()
          .filter(x => !(['id', 'upper', 'user'].includes(x[0])))
          .map((array, i) => attributesArray.push({id: i, name: `${array[0]} : ${array[1]}`}));

          return [
              ... new Topics(
                Object.fromEntries(
                  viewpoints.map(Object.entries)
                    .reduce((x, y) => [...x, ...y], [])
                    .filter(x => !(['name', 'id', 'upper', 'user'].includes(x[0])))
                )
              ).getAllPaths(),
              ...attributesArray
            ]
        }
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
      <InputWithSuggestions candidates={this.candidates(this.props.viewpoints, this.props.items)}
        onSuggestionSelected={this.handleSuggestionSelected}
        inputProps={inputProps}
        id="search"
      />
    );
  }

}

export default withRouter(SearchBar);
