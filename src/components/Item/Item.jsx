import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import Autosuggest from 'react-autosuggest';
import conf from '../../config/config.json';
import getConfig from '../../config/config.js';
import Header from '../Header/Header.jsx';
import Authenticated from '../Authenticated/Authenticated.jsx';

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
      item:{topic:[]}
    };
    // These bindings are necessary to make `this` work in the callback
    this._assignTopic = this._assignTopic.bind(this);
    this._removeTopic = this._removeTopic.bind(this);
    this._fetchItem = this._fetchItem.bind(this);
    this._getOrCreateItem = this._getOrCreateItem.bind(this);
    this._submitAttribute = this._submitAttribute.bind(this);
    this._deleteAttribute = this._deleteAttribute.bind(this);
    this.user=conf.user || window.location.hostname.split('.', 1)[0];
  }

  render() {
    let name = getString(this.state.item[itemView.name]);
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();
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

  componentDidMount() {
    let start=new Date().getTime();
    let self=this;
    this._fetchItem().then(() => {
      let end=new Date().getTime();
      let elapsedTime=end-start;
      console.log("elapsed Time ",elapsedTime);

      let intervalTime=Math.max(10000,elapsedTime*5);
      console.log("reload every ",intervalTime);
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

  _assignTopic(topicToAssign, viewpointId) {
    return this._getOrCreateItem()
      .then(data => {
        data.topics=data.topics || {};
        data.topics[topicToAssign.id] = { viewpoint: viewpointId };
        return data;
      })
      .then(hypertopic.post)
      .then(data => {
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
        .catch(error => console.log(`error : ${error}`));
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
    console.log("key down");
    if (event.key==="Escape") {
      this.setState({edit:false});
    }
    if (event.key==="Enter") {
      this.submitValue(event);
    }
  };

  handleChange = (e) => {
    console.log("Change "+e.target.value);
    this.setState({editedValue:e.target.value});
  };

  handleFocus = (e) => {
    console.log("Focus");
  }

  handleBlur = (e) => {
    console.log("Blur");

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
      <a href={link} target="_blank">Télécharger</a>
    </div>
  );
}

function Picture(item) {
  let img = getString(item[itemView.image]);
  let name = getString(item[itemView.name]);
  let link = getString(item[itemView.linkTo]);
  return (
    <div className="p-3">
      <a target="_blank" href={link} className="cursor-zoom">
        <img src={img} alt={name}/>
      </a>
    </div>
  );
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
    },10);
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
              <button type="button" className="btn btn-sm ValidateButton btn" onClick={() =>
                  this.updatingTopicList(
                    this.state.currentSelection,
                    this.props.id
                  )
                }
                onFocus={this.onTopicInputFocus} onBlur={this.onTopicInputBlur}
                disabled={!this.state.currentSelection}
                id={`validateButton-${this.state.name}`}>
                <span className="oi oi-check"> </span>
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
    for (let i = 1; i < topics.length; ++i) {
      let key="separator-"+i;
      topics.splice(i, 0, <span key={key} className="TopicSeparator">&gt;</span>);
      ++i;
    }
    const topicId = this.state.path[this.state.path.length - 1]
      ? `deleteButton-${this.state.path[this.state.path.length - 1].id}`
      : '';
    return (
      <div className="TopicPath">
        {topics}
        <button type="button" className="btn btn-xs ml-3 float-right DeleteButton"
          onClick={this.props.removeTopic} id={topicId}>
          <span className="oi oi-x"> </span>
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
    let topic = this.props.topics[id] || {};
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
