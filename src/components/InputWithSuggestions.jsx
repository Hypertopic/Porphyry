import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

class InputWithSuggestions extends Component {

  constructor(props) {
    super();
    this.state = {
      suggestions: []
    };
  }

  render() {
    const theme = {
      container: 'd-none d-sm-block',
      input: 'form-control',
      suggestionsContainer: 'dropdown open',
      suggestionsList: `dropdown-menu ${this.state.suggestions.length ? 'show' : ''}`,
      suggestion: 'dropdown-item',
      suggestionHighlighted: 'active'
    };
    return (
        <Autosuggest
          theme={theme}
          className="TopicSuggest"
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionHighlighted={this.onSuggestionHighlighted}
          onSuggestionSelected={this.props.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={this.props.inputProps}
          id={`input-${this.props.id}`}
        />
    );
  }

  getSuggestionValue = suggestion => suggestion.name;

  renderSuggestion = (suggestion, {query}) => {
    let value = suggestion.name;
    let start = value.search(new RegExp(query, "i"));
    let end = start + query.length;
    return (
      // eslint-disable-next-line
      <a className="SuggestionItem" id={suggestion.id}>
        {value.slice(0, start)}
        <b>{value.slice(start, end)}</b>
        {value.slice(end)}
      </a>
    );
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let pattern = new RegExp(value, 'i');
    let suggestions = this.props.candidates
      .filter(x => pattern.test(x.name))
      .sort((x, y) => x.name.localeCompare(y.name));
    this.setState({ suggestions });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

}

export default InputWithSuggestions;
