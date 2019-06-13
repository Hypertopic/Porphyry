import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import Autosuggest from 'react-autosuggest';
import conf from '../../config/config.json';
import getConfig from '../../config/config.js';
import Header from '../Header/Header.jsx';
import Authenticated from '../Authenticated/Authenticated.jsx';
import TopicTree from '../Outliner/TopicTree.js';

import '../../styles/App.css';

let hypertopic = new Hypertopic(conf.services);

// Get the configured item display mode
let itemView = getConfig('itemView', {
  mode: 'picture',
  name: 'name',
  image: 'resource',
  linkTo: 'resource',
  hiddenProps: ['topic', 'resource', 'thumbnail']
});

function getString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(val => getString(val)).join(', ');
  }
  return String(obj);
}

class Item extends Component {
  constructor() {
    super();
    this.state = {
      attributeInputValue:"",
      item:{topic:[]},
      resources: [],
      rev: ''
    };
    // These bindings are necessary to make `this` work in the callback
    this._assignTopic = this._assignTopic.bind(this);
    this._removeTopic = this._removeTopic.bind(this);
    this._fetchItem = this._fetchItem.bind(this);
    this._fetchResourcesAndRev = this._fetchResourcesAndRev.bind(this);
    this._getOrCreateItem = this._getOrCreateItem.bind(this);
    this._submitAttribute = this._submitAttribute.bind(this);
    this._deleteAttribute = this._deleteAttribute.bind(this);
    this._addResource = this._addResource.bind(this);
    this._deleteResource = this._deleteResource.bind(this);
    this.user=conf.user || window.location.hostname.split('.', 1)[0];
  }

  render() {
    let name = getString(this.state.item[itemView.name]);
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();
    let resources = this._getResources();
    let resourceForm = this._getResourceCreationForm();
    return (
      <div className="App container-fluid">
        <Header />
        <div className="Status row h5">
          <Authenticated/>
          <Link to="/" className="badge badge-pill badge-light TopicTag">
            <span className="badge badge-pill badge-dark oi oi-chevron-left"> </span> Retour à l'accueil
          </Link>
        </div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">Description</h2>
                <div className="p-3">
                  <h3 className="h4">Attributs du document</h3>
                  <hr/>
                  <div className="Attributes">
                    {attributes}
                  </div>
                  {this._getAttributeCreationForm()}
                  {viewpoints}
                </div>
              </div>
              <br/>
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">Ressources</h2>
                <div className="p-3">
                  <div className="Resources">
                    {resources}
                  </div>
                  <br/>
                  {resourceForm}
                </div>
              </div>
            </div>
            <div className="col-md-8 p-4">
              <div className="Subject">
                <h2 className="h4 font-weight-bold text-center">{name}</h2>
                <ShowItem item={this.state.item} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getAttributes() {
    return Object.entries(this.state.item)
      .filter(x => !itemView.hiddenProps.includes(x[0]))
      .map(x => (
        <Attribute  key={x[0]} myKey={x[0]} value={x[1][0]}
          setAttribute={this._setAttribute.bind(this)} deleteAttribute={this._deleteAttribute}/>
      ));
  }

  _getViewpoints() {
    return Object.entries(this.state.item.topic).map(v =>
      <Viewpoint key={v[0]} id={v[0]} topics={v[1]}
        assignTopic={this._assignTopic} removeTopic={this._removeTopic} />
    );
  }

  _getResources() {
    return Object.entries(this.state.resources).map(resource =>
      <Resource
        match={this.props.match}
        name={resource[0]}
        deleteResource={this._deleteResource}
        key={resource[1].digest}
      />
    );
  }

  componentDidMount() {
    let start=new Date().getTime();
    let self=this;
    this._fetchResourcesAndRev();
    this._fetchItem().then(() => {
      let end=new Date().getTime();
      let elapsedTime=end-start;

      let intervalTime=Math.max(10000,elapsedTime*5);
      self._timer = setInterval(
        () => {
          self._fetchItem();
        },
        intervalTime
      );
    });
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _getOrCreateItem() {
    return hypertopic.get({_id: this.props.match.params.item})
    .catch(e => {
      return {
        _id: this.props.match.params.item,
        item_corpus: this.props.match.params.corpus
      };
    });
  }

  _fetchItem() {
    let uri = this.props.match.url;
    let params = this.props.match.params;
    return hypertopic.getView(uri).then((data) => {
      let item = data[params.corpus][params.item];
      let itemTopics = (item.topic) ? groupBy(item.topic, ['viewpoint']) : {};
      let topics=this.state.item.topic || {};
      for (let id in itemTopics) {
        topics[id]=itemTopics[id];
      }
      item.topic=topics;
      this.setState({item});
    }).then(() => hypertopic.getView(`/user/${this.user}`))
      .then((data) => {
      let user = data[this.user] || {};
      if (user.viewpoint) {
        let topic=this.state.item.topic;
        for (let vp of user.viewpoint) {
          topic[vp.id]=topic[vp.id] || [];
        }
        this.setState({topic});
      }
    });
  }

  _fetchResourcesAndRev() {
    fetch(`${conf.services[0]}/${this.props.match.params.item}`)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            this.setState({
              rev: json._rev,
              resources: json._attachments || []
            });
          });
        }
      });
  }

  _getAttributeCreationForm() {
    var classes=["AttributeForm","input-group"];

    function isValidValue(attribute) {
      let [key,value]=attribute.split(":").map(t => t.trim());
      return key && value && !itemView.hiddenProps.includes(key);
    }

    let attributeInputChange=(e) => {
      this.setState({ attributeInputValue:e.target.value });
    }

    let attributeInputChangeKeyDown=(e) => {
      if (e.key==="Escape") {
        this.setState({ attributeInputValue:"" });
      }
    }

    let attributeInputFocus=(e) => {
      if (this.blurTimeout) {
        this.blurTimeout=clearTimeout(this.blurTimeout);
      }
      this.setState({attributeInputFocus:true});
    }

    let attributeInputBlur=(e) => {
      this.blurTimeout=setTimeout(() => {
        this.setState({attributeInputFocus:false})
      }, 200);
    }

    var valid=false;

    if (!this.state.attributeInputFocus) {
      classes.push("inactive");
    } else if (isValidValue(this.state.attributeInputValue)) {
      valid=true;
      let editedAttribute=this.state.attributeInputValue.split(":").map(t => t.trim())[0];
      if (this.state.item[editedAttribute]) {
        classes.push("modify")
      }
    }

    var placeholder="Ajouter un attribut et une valeur...";
    if (this.state.attributeInputFocus) {
      placeholder="attribut : valeur";
    }

    return (
      <form onSubmit={this._submitAttribute} className={classes.join(" ")}>
        <div className="attributeInput">
          <input ref={(input) => this.attributeInput=input} value={this.state.attributeInputValue}
            onChange={attributeInputChange} onKeyDown={attributeInputChangeKeyDown}
            onFocus={attributeInputFocus} onBlur={attributeInputBlur}
            id="new-attribute" className="form-control" placeholder={placeholder} type="text" />
        </div>
        <div className="input-group-append">
          <button type="button" className="btn btn-sm ValidateButton btn"
            onClick={this._submitAttribute}
            onFocus={attributeInputFocus} onBlur={attributeInputBlur}
            disabled={!valid}
            id={`validateButton-${this.state.name}`}>
            <span className="oi oi-check"> </span>
          </button>
        </div>
      </form>
    );
  }

  _getResourceCreationForm() {
    return (
      <form className="Resource">
        <div className="custom-file">
          <input
            id="resourceName"
            className="custom-file-input"
            placeholder="Attribut"
            type="file"
            onChange={this._addResource}
          />
          <label className="custom-file-label" htmlFor="resourceName">Ajouter une ressource...</label>
        </div>
      </form>
    );
  }

  _setAttribute(key, value) {
    if (key!=='' && value!=='') {
      let attribute = {[key]: [value]};
      return this._getOrCreateItem()
        .then(x => Object.assign(x, attribute))
        .then(hypertopic.post)
        .then(_ => this.setState(previousState => {
          previousState.item[key]=[value];
          return previousState
        }))
        .catch((x) => console.error(x.message));
    } else {
      console.error('Créez un attribut non vide');
      return new Promise().fail();
    }
  }

  _submitAttribute(e) {
    e.preventDefault();
    let key_value = this.state.attributeInputValue;
    if (key_value) {
      let [key,value]=key_value.split(":").map(t => t.trim());
      if (key && value) this._setAttribute(key, value);
      else return false;
    }
    this.setState({
      attributeInputValue: ""
    });
    this.attributeInput.focus();
    return false;
  }

  _deleteAttribute(key) {
    const _error = (x) => console.error(x.message);
    this._getOrCreateItem()
      .then(x => {
        delete x[key];
        return x;
      })
      .then(hypertopic.post)
      .then(_ => {
        this.setState(previousState => {
          delete previousState.item[key];
          return {item:previousState.item};
        });
      })
      .catch(_error);
  }

  _addResource(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
        const headers = {
          'Content-Type': file.type,
        };
        if (this.state.rev) {
          // Only send the revision if we already have one
          // If we don't have a revision, it probably means there's no document on Argos yet (and therefore no attachments)
          headers['If-Match'] = this.state.rev;
        }

        // Add an attachment to Argos
        fetch(
          `${conf.services[0]}/item/${this.props.match.params.corpus}/${this.props.match.params.item}/${file.name}`,
          {
            method: 'PUT',
            credentials: 'include',
            body: reader.result,
            headers
          }
        ).then(response => {
          if (response.ok) {
            this._fetchResourcesAndRev();
          }
        });
    };

    reader.onerror = () => {
      console.log('Could not initialize FileReader');
    };
  }

  _deleteResource(name) {
    // Remove an attachment from Argos
    fetch(
      `${conf.services[0]}/item/${this.props.match.params.corpus}/${this.props.match.params.item}/${name}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'If-Match': this.state.rev
        }
      }
    ).then(response => {
      if (response.ok) {
        this._fetchResourcesAndRev();
      }
    });
  }

  _assignTopic(topicToAssign, viewpointId) {
    return this._getOrCreateItem()
      .then(data => {
        data.topics=data.topics || {};
        data.topics[topicToAssign] = { viewpoint: viewpointId };
        return data;
      })
      .then(hypertopic.post)
      .then(data => {
        this.setState(newState => {
          newState.topic[viewpointId].push({
            viewpoint: viewpointId,
            id: topicToAssign
          });
          return newState;
        })
      })
      .catch(error => console.error(error));
  }


  _removeTopic(topicToDelete) {
    if (window.confirm('Voulez-vous réellement que l\'item affiché ne soit plus décrit à l\'aide de cette rubrique ?')) {
      return this._getOrCreateItem()
        .then(data => {
          data.topics=data.topics || {};
          delete data.topics[topicToDelete.id];
          return data;
        })
        .then(hypertopic.post)
        .then((res)=> {
          let newState = this.state;
          newState.topic[topicToDelete.viewpoint] = newState.topic[
            topicToDelete.viewpoint
          ].filter(stateTopic => topicToDelete.id !== stateTopic.id);
          this.setState(newState);
        })
        .catch(error => console.error(error));
    }
  }
}

class Attribute extends Component {

  constructor() {
    super();
    this.state = {
      editedValue:""
    };
  }

  onKeyDown = (event) => {
    if (event.key==="Escape") {
      this.setState({edit:false});
    }
    if (event.key==="Enter") {
      this.submitValue(event);
    }
  };

  handleChange = (e) => {
    this.setState({editedValue:e.target.value});
  };

  handleFocus = (e) => {
  }

  handleBlur = (e) => {
  }

  setEdit = (e) => {
    this.setState({edit:true,editedValue:this.props.value});
  }

  submitValue = (e) => {
    this.props.setAttribute(this.props.myKey,this.state.editedValue).then(
      _ => this.setState({edit:false})
    );
  }

  render() {
    var valueCtl,deleteButton,editButton;
    let valid=this.state.editedValue;
    if (!this.state.edit) {
      valueCtl=(
        <div className="Value">
          {this.props.value}
        </div>
      );
      editButton=(
        <button onClick={this.setEdit} className="btn btn-xs EditButton">
          <span className="oi oi-pencil"> </span>
        </button>
      );
      deleteButton=(
        <button onClick={this.props.deleteAttribute.bind(this,this.props.myKey)} className="btn btn-xs DeleteButton">
          <span className="oi oi-x"> </span>
        </button>
      );
    } else {
      valueCtl=(
        <div className="Value edit">
          <input value={this.state.editedValue} placeholder="valeur obbligatoire"
            autoFocus
            onChange={this.handleChange} onKeyDown={this.onKeyDown}
            onFocus={this.handleFocus} onBlur={this.handleBlur}
          />
          <button type="button" className="btn btn-sm ValidateButton btn"
            onClick={this.submitValue}
            onFocus={this.handleFocus} onBlur={this.handleBlur}
            disabled={!valid}
            id={`validateButton-${this.props.myKey}`}>
            <span className="oi oi-check"> </span>
          </button>
        </div>
      );
    }
    return (
      <div className="Attribute">
        <div className="Key">
          {this.props.myKey}
        </div>
        {valueCtl}
        <div className="buttons">
          {editButton}
          {deleteButton}
        </div>
      </div>
    );
    }
}

function ShowItem(props) {
  switch (itemView.mode) {
  case 'article':
    return Article(props.item);
  case 'picture':
    return Picture(props.item);
  default:
    return Picture(props.item);
  }
}

function Article(item) {
  let text = getString(item[itemView.text]);
  let link = getString(item[itemView.linkTo]);
  return (
    <div className="p-4">
      <p>{text}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">Télécharger</a>
    </div>
  );
}

function Picture(item) {
  let img = getString(item[itemView.image]);
  let name = getString(item[itemView.name]);
  let link = getString(item[itemView.linkTo]);
  return (
    <div className="p-3">
      <a target="_blank" href={link} className="cursor-zoom" rel="noopener noreferrer">
        <img src={img} alt={name}/>
      </a>
    </div>
  );
}

class Resource extends Component {

  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  setEdit = (event) => {
    this.setState({
      edit: true,
      editedValue: this.props.value
    });
  }

  render() {
    let deleteButton;
    if (!this.state.edit) {
      deleteButton = (
        <button onClick={this.props.deleteResource.bind(this, this.props.name)} className="btn btn-xs DeleteTopicButton">
          <span className="oi oi-x"> </span>
        </button>
      );
    } else {
      deleteButton = null;
    }

    // CouchDB attachment from Argos
    const url = `${conf.services[0]}/item/${this.props.match.params.corpus}/${this.props.match.params.item}/${this.props.name}`

    return (
      <div className="Resource">
        <div className="resourceName">
          <a download={this.props.name} href={url} target="_blank">
            {this.props.name}
          </a>
        </div>
        <div className="buttons">
          {deleteButton}
        </div>
      </div>
    )
  }
}

class Viewpoint extends Component {
  constructor(props) {
    super();
    this.state = {
      topicInputvalue: '',
      suggestions: [],
      currentSelection: '',
      currentPreSelection: ''
    };
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  getSuggestionValue = suggestion => suggestion.name;

  renderSuggestion = suggestion => {
    return (
      // eslint-disable-next-line
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

  onTopicInputFocus = (event) => {
    if (this.blurTimeout) {
      this.blurTimeout=clearTimeout(this.blurTimeout);
    }
    this.setState({hasFocus:true});
  }

  onTopicInputBlur = (event) => {
    this.blurTimeout=setTimeout(() => {
      this.setState({hasFocus:false});
    },200);
  }

  onTopicInputkeyDown = (event) => {
    if (event.key==="Escape") {
      this.clearInput();
    }
  };

  onTopicInputChange = (event, { newValue }) => {
    if (this.state.currentSelection) {
      newValue="";
    }
    this.setState({
      topicInputvalue: newValue,
      currentSelection:""
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
    this.setState({ currentSelection: suggestion });
  };

  onSuggestionHighlighted = ({ suggestion }) => {
    if (suggestion && suggestion.id) {
      this.setState({ currentPreSelection: suggestion.id });
    } else {
      this.setState({ currentPreSelection: '' });
    }
  };

  clearInput = () => {
    this.setState({
      topicInputvalue: '',
      currentSelection: '',
      currentPreSelection: '',
      suggestions: [],
      newTopic:""
    });
  };

  updatingTopicList = (topicToAssign, viewpointId) => {
    return this.props
      .assignTopic(topicToAssign, viewpointId)
      .catch(error => console.error(error));
  };

  render() {
    const paths = this._getPaths();
    const { topicInputvalue, suggestions } = this.state;
    const inputProps = {
      placeholder: this.state.newTopic ? 'Choisir une rubrique parent...' : 'Ajouter une rubrique...',
      value: topicInputvalue,
      onFocus: this.onTopicInputFocus,
      onBlur: this.onTopicInputBlur,
      onChange: this.onTopicInputChange,
      onKeyDown: this.onTopicInputKeyDown,
    };
    const theme = {
      container: 'autosuggest',
      input: 'form-control',
      suggestionsContainer: 'dropdown open',
      suggestionsList: `dropdown-menu ${suggestions.length ? 'show' : ''}`,
      suggestion: 'dropdown-item',
      suggestionHighlighted: 'active'
    };
    var classes=["TopicAdding","input-group"];
    if (!this.state.hasFocus) {
      classes.push("inactive");
    }
    var newTopic;
    if (this.state.newTopic) {
      newTopic=<div className="newTopic">Ajouter nouveau : &gt; {this.state.newTopic}
      <button type="button" className="btn btn-xs ml-3 float-right DeleteButton"
        onClick={_ => this.setState({newTopic:""})} id="deleteButton-newTopic">
        <span className="oi oi-x"> </span>
      </button></div>;
    }
    const canValidateTopic=this.state.currentSelection || this.state.newTopic || this.state.topicInputvalue.length > 2;
    return (
      <div>
        <h3 className="h4">{this.state.name}</h3>
        <hr/>
        <div className="Topics">
          {paths}
          <div className={classes.join(" ")}>
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
            <div className="input-group-append">
              <button type="button" className="btn btn-sm ValidateButton btn" onClick={() => {
                  if (this.state.newTopic && (this.state.currentSelection || !this.state.topicInputvalue)) {
                    var parentId;
                    if (this.state.currentSelection) parentId=this.state.currentSelection.id
                    this.createTopic(this.state.newTopic,parentId)
                      .then(newId => {
                        this.updatingTopicList(
                          newId,
                          this.props.id
                        )
                      })
                      .then(this.clearInput);
                  } else {
                    if (this.state.currentSelection) {
                      this.updatingTopicList(
                        this.state.currentSelection.id,
                        this.props.id
                      ).then(this.clearInput);
                    } else {
                      this.setState({
                        newTopic:this.state.topicInputvalue,
                        topicInputvalue:""
                      });
                    }
                  }
                }}
                onFocus={this.onTopicInputFocus} onBlur={this.onTopicInputBlur}
                disabled={!canValidateTopic}
                id={`validateButton-${this.state.name}`}>
                <span className="oi oi-check"> </span>
              </button>
            </div>
            {newTopic}
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

  createTopic(name,parent) {
    var newId;
    return hypertopic.get({ _id: this.props.id })
      .then(x => {
        var topicTree=new TopicTree(x.topics);
        var newParent=parent || 'root';
        var newTopic=topicTree.newChildren(newParent);
        newTopic.name=name;
        newId=newTopic.id;
        delete newTopic.id;
        x.topics=topicTree.topics;
        return x;
      })
      .then(hypertopic.post)
      .then(_ => {
        this.setState(previousState => {
          let newTopic={
            id:newId,
            name:[name]
          };
          if (parent) {
            newTopic.broader=[{
              id:parent,
              name:previousState.topics[parent].name
            }];
          }
          previousState.topics[newId]=newTopic;
          return previousState;
        })
      })
      .then(_ => {return newId});
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
    for (let i = 1; i < topics.length; ++i) {
      let key="separator-"+i;
      topics.splice(i, 0, <span key={key} className="TopicSeparator">&gt;</span>);
      ++i;
    }
    const topicId = this.state.path[this.state.path.length - 1]
      ? `${this.state.path[this.state.path.length - 1].id}`
      : '';
    return (
      <div className="TopicPath">
        {topics}
        <button type="button" className="btn btn-xs ml-3 float-right DeleteButton"
          onClick={this.props.removeTopic} id={`deleteButton-${topicId}`}>
          <span className="oi oi-x"> </span>
        </button>
      </div>
    );
  }

  componentDidMount() {
    let topic = this._getTopic(this.props.id);
    let path = [topic];
    while (topic.broader && topic.broader.length) {
      topic = this._getTopic(topic.broader[0].id);
      path.unshift(topic);
    }
    this.setState({path});
  }

  _getTopic(id) {
    let topic = this.props.topics[id] || {};
    topic.id = id;
    return topic;
  }

  _getTopics() {
    return this.state.path.map( t => {
      let name = (t.name)? t.name : 'Sans nom';
      let uri = '../../?t=' + t.id;
      return (
        <Link title={t.id} key={t.id} className="Topic" to={uri}>{name}</Link>
      );
    });
  }

}

export default Item;
