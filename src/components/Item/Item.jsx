import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import Autosuggest from 'react-autosuggest';
import conf from '../../config/config.json';
import Header from '../Header/Header.jsx';

import '../../styles/App.css';

class Item extends Component {
  constructor() {
    super();
    this.state = {
      isCreatable: false,
      topic: []
    };
    // These bindings are necessary to make `this` work in the callback
    this._assignTopic = this._assignTopic.bind(this);
    this._removeTopic = this._removeTopic.bind(this);
    this._fetchItem = this._fetchItem.bind(this);
    this._checkIsCreatable = this._checkIsCreatable.bind(this);
  }

  render() {
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();
    let attributeButtonLabel = this.state.isCreatable? 'Valider' : 'Ajouter un attribut';
    let attributeForm = this.state.isCreatable? this._getAttributeCreationForm() : '';
    return (
      <div className="App container-fluid">
        <Header />
        <div className="Status row h5"><a href="/">Retour à l'accueil</a></div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">Description</h2>
                <div className="p-3">
                  <h3 className="h4">Attributs du document</h3>
                  <hr/>
                  <button className="btn btn-block creationButton" onClick={this._checkIsCreatable}>{attributeButtonLabel}</button>
                  <div className="Attributes">
                    {attributes}
                    {attributeForm}
                  </div>
                  {viewpoints}
                </div>
              </div>
            </div>
            <div className="col-md-8 p-4">
              <div className="Subject">
                <h2 className="h4 font-weight-bold text-center">{this.state.name}</h2>
                <div className="p-3">
                  <img src={this.state.resource} alt="resource"/>
                  <p className="fullImage">
                    <a target="_blank" href={this.state.resource}>
                      Voir l'image en taille réelle.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getAttributes() {
    return Object.entries(this.state)
      .filter(x => !['topic', 'resource', 'thumbnail', 'isCreatable'].includes(x[0]))
      .map(x => (
        <div className="Attribute" key={x[0]}>
          <div className="Key">{x[0]}</div>
          <div className="Value">{x[1][0]}</div>
        </div>
      ));
  }

  _getViewpoints() {
    return Object.entries(this.state.topic).map(v =>
      <div>
        <hr/>
        <Viewpoint key={v[0]} id={v[0]} topics={v[1]}
          assignTopic={this._assignTopic} removeTopic={this._removeTopic} />
      </div>
    );
  }

  componentDidMount() {
    this._fetchItem();
    this._timer = setInterval(
      () => this._fetchItem(),
      15000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _fetchItem() {
    let uri = this.props.match.url;
    let params = this.props.match.params;
    let hypertopic = new Hypertopic(conf.services);
    hypertopic.getView(uri).then((data) => {
      let item = data[params.corpus][params.item];
      item.topic = (item.topic) ? groupBy(item.topic, ['viewpoint']) : [];
      this.setState(item);
    });
  }

  _getAttributeCreationForm() {
    return (
      <form className="Attribute">
        <div className="Key"> <input id="key" className="form-control" placeholder="Attribut" type="text" size="8" /></div>
        <div className="Value"> <input id="value" className="form-control" placeholder="Valeur" type="text" /></div>
      </form>
    );
  }

  _setAttribute(key, value) {
    if (key!=='' && value!=='') {
      let hypertopic = new Hypertopic(conf.services);
      let attribute = {[key]: [value]};
      hypertopic.get({_id: this.props.match.params.item})
        .then(x => Object.assign(x, attribute))
        .then(hypertopic.post)
        .catch((x) => console.error(x.message));
      this.setState(attribute);
    } else {
      console.log('Créez un attribut non vide');
    }
  }

  _checkIsCreatable() {
    this.setState(prevState => ({
      isCreatable: !prevState.isCreatable
    }));
    if (this.state.isCreatable) {
      let key = document.getElementById('key').value;
      let value = document.getElementById('value').value;
      this._setAttribute(key, value);
    }
  }

  _assignTopic(topicToAssign, viewpointId) {
    let hypertopic = new Hypertopic(conf.services);
    return hypertopic.get({ _id: this.props.match.params.item })
      .then(data => {
        data.topics[topicToAssign.id] = { viewpoint: viewpointId };
        return data;
      })
      .then(data => {
        hypertopic.post(data);
        let newState = this.state;
        newState.topic[viewpointId].push({
          viewpoint: viewpointId,
          id: topicToAssign.id
        });
        this.setState(newState);
      })
      .catch(error => console.log(`error : ${error}`));
  }


  _removeTopic(topicToDelete) {
    let params = this.props.match.params;
    let hypertopic = new Hypertopic(conf.services);

    if (window.confirm('Voulez-vous réellement que l\'item affiché ne soit plus décrit à l\'aide de cette rubrique ?')) {
      hypertopic
        .get({ _id: params.item })
        .then(data => {
          delete data.topics[topicToDelete.id];
          return data;
        })
        .then(data => {
          hypertopic.post(data);
          let newState = this.state;
          newState.topic[topicToDelete.viewpoint] = newState.topic[
            topicToDelete.viewpoint
          ].filter(stateTopic => topicToDelete.id !== stateTopic.id);
          if (newState.topic[topicToDelete.viewpoint].length === 0) {
            delete newState.topic[topicToDelete.viewpoint];
          }
          this.setState(newState);
        })
        .catch(error => console.log(`error : ${error}`));
    }
  }
}

class Viewpoint extends Component {
  constructor(props) {
    super();
    this.state = {
      topicInputvalue: '',
      suggestions: [],
      canValidateTopic: false,
      currentSelection: '',
      currentPreSelection: ''
    };
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  getSuggestionValue = suggestion => suggestion.name;

  renderSuggestion = suggestion => {
    return (
      <a className="SuggestionItem" id={suggestion.id}>
        {suggestion.name}
      </a>
    );
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const ressourceId = window.location.href.substr(
      window.location.href.lastIndexOf('/') + 1
    );

    let filteredTopics = [];
    if (inputLength !== 0) {
      for (let id in this.state.topics) {
        const topic = this.state.topics[id];
        let alreadyAssigned = false;
        if (topic.item) {
          topic.item.forEach(item => {
            if (item.id === ressourceId) {
              alreadyAssigned = true;
            }
          });
        }

        if (
          !alreadyAssigned &&
          topic.name &&
          topic.name[0] &&
          topic.name[0].toLowerCase().slice(0, inputLength) === inputValue
        ) {
          let fullName =
            topic.name[0].slice(0, inputLength).toUpperCase() +
            topic.name[0].slice(inputLength);
          let currentTopic = topic;
          while (currentTopic.broader) {
            currentTopic = this.state.topics[currentTopic.broader[0].id];
            fullName = `${currentTopic.name} > ${fullName}`;
          }
          filteredTopics.push({
            name: fullName,
            id: id
          });
        }
      }
    }
    return filteredTopics;
  };

  onTopicInputChange = (event, { newValue }) => {
    this.setState({
      topicInputvalue: newValue
    });
    this.setState({
      canValidateTopic: false
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({ canValidateTopic: true, currentSelection: suggestion });
  };

  onSuggestionHighlighted = ({ suggestion }) => {
    console.log(suggestion);
    if (suggestion && suggestion.id) {
      this.setState({ currentPreSelection: suggestion.id });
    } else {
      this.setState({ currentPreSelection: '' });
    }
  };

  clearInput = () => {
    this.setState({
      topicInputvalue: '',
      canValidateTopic: false,
      currentSelection: '',
      currentPreSelection: '',
      suggestions: []
    });
  };

  updatingTopicList = (topicToAssign, viewpointId) => {
    this.props
      .assignTopic(topicToAssign, viewpointId)
      .then(this.clearInput)
      .catch(error => console.log(`error : ${error}`));
  };

  render() {
    const paths = this._getPaths();
    const { topicInputvalue, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Ajouter une rubrique...',
      value: topicInputvalue,
      onChange: this.onTopicInputChange
    };
    const theme = {
      container: 'autosuggest',
      input: 'form-control',
      suggestionsContainer: 'dropdown open',
      suggestionsList: `dropdown-menu ${suggestions.length ? 'show' : ''}`,
      suggestion: 'dropdown-item',
      suggestionHighlighted: 'active'
    };
    return (
      <div>
        <h3 className="h4">{this.state.name}</h3>
        <hr/>
        <div className="Topics">
          {paths}
          <div className="TopicAdding input-group">
            <Autosuggest
              theme={theme}
              className="TopicSuggest"
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionHighlighted={this.onSuggestionHighlighted}
              onSuggestionSelected={this.onSuggestionSelected}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
              id={`input-${this.state.name}`}
            />
            <div class="input-group-append">
              <button type="button" className="TopicValidateButton btn" onClick={() =>
                  this.updatingTopicList(
                    this.state.currentSelection,
                    this.props.id
                  )
                }
                disabled={!this.state.canValidateTopic}
                id={`validateButton-${this.state.name}`}>
                ✓
              </button>
              <button type="button" className="TopicCancelButton btn" onClick={this.clearInput}
                id={`cancelButton-${this.state.name}`}>
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getPaths() {
    if (!this.state.topics) return [];
    return this.props.topics.map(t => (
      <TopicPath
        key={t.id}
        id={t.id}
        topics={this.state.topics}
        removeTopic={() => this.props.removeTopic(t)}
      />
    ));
  }

  componentDidMount() {
    this._fetchViewpoint();
  }

  _fetchViewpoint() {
    const hypertopic = new Hypertopic(conf.services);
    let uri = '/viewpoint/' + this.props.id;
    hypertopic.getView(uri).then((data) => {
      let viewpoint = data[this.props.id];
      let name = viewpoint.name;
      let topics = viewpoint;
      delete topics.user;
      delete topics.name;
      delete topics.upper;
      this.setState({name, topics});
    });
  }
}

class TopicPath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: []
    };
  }

  render() {
    let topics = this._getTopics();
    const topicId = this.state.path[this.state.path.length - 1]
      ? `deleteButton-${this.state.path[this.state.path.length - 1].id}`
      : '';
    return (
      <div className="TopicPath">
        {topics}
        <button type="button" className="btn btn-sm ml-3 DeleteTopicButton"
          onClick={this.props.removeTopic} id={topicId}>
          x
        </button>
      </div>
    );
  }

  componentDidMount() {
    let topic = this._getTopic(this.props.id);
    let path = [topic];
    while (topic.broader) {
      topic = this._getTopic(topic.broader[0].id);
      path.unshift(topic);
    }
    this.setState({path});
  }

  _getTopic(id) {
    let topic = this.props.topics[id];
    topic.id = id;
    return topic;
  }

  _getTopics() {
    return this.state.path.map( t => {
      let name = (t.name)? t.name : 'Sans nom';
      let uri = '../../?t=' + t.id;
      return (
        <Link key={t.id} className="Topic" to={uri}>{name}</Link>
      );
    });
  }

}

export default Item;
