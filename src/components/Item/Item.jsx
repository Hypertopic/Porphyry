import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import Autosuggest from 'react-autosuggest';
import conf from '../../config/config.json';
import getConfig from '../../config/config.js';
import Header from '../Header/Header.jsx';
import getConfig from '../../config/config.js'
import FacebookProvider, { Comments } from 'react-facebook';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';

import '../../styles/App.css';

let hypertopic = new Hypertopic(conf.services);

// Get the configured item display mode
let itemView = getConfig('itemView', {
  mode: 'picture',
  name: 'name',
  image: 'resource',
  linkTo: 'resource',
  hiddenProps: ['topic', 'resource', 'thumbnail', 'isCreatable']
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
      isCreatable: false,
      topic: [],
      corpora: [],
      sameNamePicsDict: [],
      item: {},
      items: [],
      uri: null,
      params: null
    };
    this.isFoundSameNamePic = false;
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
    // Read Facebook comment config file
    this.fbConfig = getConfig("facebookComment", {
      "enable":false,
      "Appid":null
    });
    // These bindings are necessary to make `this` work in the callback
    this._assignTopic = this._assignTopic.bind(this);
    this._removeTopic = this._removeTopic.bind(this);
    this._fetchItem = this._fetchItem.bind(this);
    this._checkIsCreatable = this._checkIsCreatable.bind(this);
    this.deleteAttribute = this.deleteAttribute.bind(this);
  }

  render() {
    let name = getString(this.state[itemView.name]);
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();
    let comment = this._getFacebookComment();
    let attributeButtonLabel = this.state.isCreatable? 'Valider' : 'Ajouter un attribut';
    let attributeForm = this.state.isCreatable? this._getAttributeCreationForm() : '';
    let imageGalleryProps = {
      renderItem: this.renderImg,
      onThumbnailClick: this.clickChangeItem.bind(this),
      onSlide: this.slideChangeItem.bind(this),
      showPlayButton: false,
      showFullscreenButton: false,
      showIndex: true,
      showBullets: true,
      items: this.state.sameNamePicsDict
    };
    return (
      <div className="App container-fluid">
        <Header />
        <div className="Status row h5"><Link to="/" className="badge badge-pill badge-light TopicTag">
          <span className="badge badge-pill badge-dark oi oi-chevron-left"> </span> Retour à l'accueil
        </Link></div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">Description</h2>
                <div className="p-3">
                  <h3 className="h4">Attributs du document</h3>
                  <hr/>
                  <div className="text-center">
                    <button className="btn btn-light creationButton" onClick={this._checkIsCreatable}>{attributeButtonLabel}</button>
                  </div>
                  <div className="Attributes">
                    {attributes}
                    {attributeForm}
                  </div>
                  {viewpoints}
                  {comment}
                </div>
              </div>
            </div>
            <div className="col-md-8 p-4">
              <div className="Subject">
                <h2 className="h4 font-weight-bold text-center">{this.state.item.name}</h2>
                <div className="p-3">
                  <ImageGallery  {...imageGalleryProps}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  slideChangeItem(index){
    this.changeItem(index);
  }

  clickChangeItem(event,index){
    this.changeItem(index);
  }

  changeItem(index){
    const item = this.state.items[index];
    let uri = null;
    let params = null;
    // Record new selected pic
    if(item.corpus&&item.id){
      uri = "/item/"+item.corpus+"/"+item.id;
      params = {corpus:item.corpus, item:item.id};
      delete item.id;
      delete item.corpus;
    }
    this.setState({item:item, uri:uri, params: params});
  }

  renderImg(img){
    return (
      <a target="_blank" href={img.original[0]} className="cursor-zoom">
        <img src={img.original[0]} alt={img.originalAlt[0]}/>
      </a>
    );
  }

  _getFacebookComment(){
    if(this.fbConfig.enable) {
      let c_url = String(this.state.item.resource);
      return (
        <div className="p-3">
          <hr/>
          <h3 className="h4">Commentaire du document</h3>
          <hr/>
          <FacebookProvider appId={this.fbConfig.Appid}>
            <Comments width="100%" href={c_url} />
          </FacebookProvider>
        </div>
      );
    } else {
      return null;
    }
  }

  _getAttributes() {
    return Object.entries(this.state.item)
      .filter(x => !['topic', 'resource', 'thumbnail', 'isCreatable'].includes(x[0]))
      .map(x => (
        <div className="Attribute" key={x[0]}>
          <div className="Key">{x[0]}</div>
          <div className="Value">{x[1][0]}</div>
          <button onClick={this.deleteAttribute.bind(this,x[0])} className="btn btn-xs ml-3 DeleteTopicButton">
            <span className="oi oi-x"> </span>
          </button>
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

    let newUri = this.state.uri;
    let newParams = this.state.params;
    if(newUri&&newParams){
      uri = newUri;
      params = newParams;
    }
    hypertopic.getView(uri).then((data) => {
      let item = data[params.corpus][params.item];
      item.topic = (item.topic) ? groupBy(item.topic, ['viewpoint']) : [];
      this.setState({item:item});

      // Find all the same name pics
      if(!this.isFoundSameNamePic){
        this.setState({sameNamePicsDict:[{
          original: item.resource,
          thumbnail: item.resource,
          originalAlt: "resource"
        }]});

        hypertopic.getView(`/user/${this.user}`)
        .then(data => {
          let user = data[this.user];
          if (!this.state.corpora.length) {
            this.setState({corpora:user.corpus});
          }
          return user;
        })
        .then(x =>
          x.viewpoint.map(y => `/viewpoint/${y.id}`)
            .concat(x.corpus.map(y => `/corpus/${y.id}`))
        )
        .then(hypertopic.getView)
        .then(data => {
          let allSameNameDict = [{
            original: item.resource,
            thumbnail: item.thumbnail,
            originalAlt: "resource"
          }];
          let _items = [item];
          for (let corpus of this.state.corpora) {
            for (let itemId in data[corpus.id]) {
              if (!['id','name','user'].includes(itemId)) {
                let _item = data[corpus.id][itemId];
                if (!_item.name || !_item.name.length || !_item.thumbnail || !_item.thumbnail.length) {
                  console.log(itemId, "has no name or thumbnail!", _item);
                } else {
                  if(_item.resource[0]!==item.resource){
                    _item.id = itemId;
                    _item.corpus = corpus.id;
                    const names = _item.name;
                    const namesLen = names.length;
                    const _names = item.name;
                    const _namesLen = _names.length;
                    let i = 0;
                    let j = 0;
                    for(i=0;i<namesLen;i++){
                      for(j=0;j<_namesLen;j++){
                        if(names[i]===_names[j]){
                          let picItem = {
                            original: _item.resource,
                            thumbnail: _item.thumbnail,
                            originalAlt: "resource"
                          };
                          allSameNameDict.push(picItem);
                          _items.push(_item);
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          this.setState({sameNamePicsDict:allSameNameDict, items:_items});
          this.isFoundSameNamePic = true;
        });
      }
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

  deleteAttribute(key) {
    const _error = (x) => console.error(x.message);
    hypertopic.get({_id:this.props.match.params.item})
      .then(x => {
        delete x[key];
        delete this.state[key];
        this.setState(this.state);
        return x;
      })
      .then(hypertopic.post)
      .catch(_error);
  }

  _assignTopic(topicToAssign, viewpointId) {
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
            <div className="input-group-append">
              <button type="button" className="btn btn-sm TopicValidateButton btn" onClick={() =>
                  this.updatingTopicList(
                    this.state.currentSelection,
                    this.props.id
                  )
                }
                disabled={!this.state.canValidateTopic}
                id={`validateButton-${this.state.name}`}>
                <span className="oi oi-check"> </span>
              </button>
              <button type="button" className="btn btn-sm TopicCancelButton btn" onClick={this.clearInput}
                id={`cancelButton-${this.state.name}`}>
                <span className="oi oi-x"> </span>
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
        topics.splice(i, 0, <span className="TopicSeparator">&gt;</span>);
        ++i;
    }
    const topicId = this.state.path[this.state.path.length - 1]
      ? `deleteButton-${this.state.path[this.state.path.length - 1].id}`
      : '';
    return (
      <div className="TopicPath">
        {topics}
        <button type="button" className="btn btn-xs ml-3 float-right DeleteTopicButton"
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
