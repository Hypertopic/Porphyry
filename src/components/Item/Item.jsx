import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import Autosuggest from 'react-autosuggest';
import conf from '../../config/config.json';
import '../../styles/App.css';

class Item extends Component {
  constructor() {
    super();
    this.state = {
    topic: [],
    isCreatable: false,
    isDeletable: false
    };
    // These bindings are necessary to make `this` work in the callback
    this._assignTopic = this._assignTopic.bind(this);
    this._removeTopic = this._removeTopic.bind(this);
    this._fetchItem = this._fetchItem.bind(this);
    this.checkIsCreatable = this.checkIsCreatable.bind(this);
    this.buttonValidateCreate =this.buttonValidateCreate.bind(this);
    this.buttonCreate = this.buttonCreate.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleValidateDeleteClick = this.handleValidateDeleteClick.bind(this);
    this.deleteAttribut = this.deleteAttribut.bind(this);
  }

  render() {
    //console.log('DEBUG' ,this);
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();

    return (
      <div className="App">
        <h1>{this.state.name}</h1>
        <div className="Status">Item</div>
        <div className="App-content">
          <div className="Description">
            <div className="DescriptionModality">
              <h3>Attributs du document</h3>
              {!this.state.isCreatable ? this.buttonCreate(): this.buttonValidateCreate()}
              {this.state.isDeletable ?  this.buttonValidateDelete() : this.buttonDelete()}
              <div className="Attributes">
              {attributes}
              {this.state.isCreatable ? this.getForm() : ""}
              </div>

            </div>
            {viewpoints}
          </div>
          <div className="Subject">
            <div>
              <img src={this.state.resource} alt="resource" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getAttributes() {
    return Object.entries(this.state)
      .filter(x => !['topic', 'resource', 'thumbnail', 'isCreatable','isDeletable'].includes(x[0]))
      .map(x => (
        <div className="Attribute" key={x[0]}>
          <div className="Key">{x[0]}</div>
          <div className="Value">{x[1][0]}</div>
          {this.state.isDeletable ? this.getFormDeletable(x[0].concat("Button")) : ""}
        </div>
      ));
  }

  _getViewpoints() {
    return Object.entries(this.state.topic).map(v => (
      <Viewpoint
        key={v[0]}
        id={v[0]}
        topics={v[1]}
        assignTopic={this._assignTopic}
        removeTopic={this._removeTopic}
      />
    ));
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

buttonValidateCreate(){
    return(<button id="buttonCreer" onClick={this.checkIsCreatable}>Valider</button>)
  }

  buttonCreate(){
    return(<button id="buttonCreer" onClick={this.checkIsCreatable}>Creer</button>)
  }

//show the form to create a new Attribute
  getForm(){
 return(
    <form className="Attribute">
      <div className="Key"> <input id="key" type="text" size="8" /></div>
      <div className="Value"> <input id="value" type="text" size="8" /></div>
    </form>
    );
  }

  setAttribute(key,value){
    if(key!=="" && value!=="") {
      let hypertopic = new Hypertopic(conf.services);
      const _log = (x) => console.log("LOG", JSON.stringify(x, null, 2));
      const _error = (x) => console.error("ERR", x);
      var myObj = {};
      myObj[key] = value;
      hypertopic.get({_id:this.props.match.params.item})
          .then(x => Object.assign(x, myObj))
          .then(hypertopic.post)
          .then(_log)
          .catch(_error);
    }

    else console.log("Créez un attribut non vide");
  }

  checkIsCreatable(){
    this.setState(prevState => ({
       isCreatable: !prevState.isCreatable
    }))
    if(this.state.isCreatable){
      var key=document.getElementById("key").value;
      var value=document.getElementById("value").value;
      this.setAttribute(key,value);
      document.getElementById("delete").style.visibility = "visible";
   }else{
     document.getElementById("delete").style.visibility = "hidden";
   }
}

getFormDeletable(key){
     return(
       <button id={key} value="delete" onClick={this.deleteAttribut.bind(this,key)}>X</button>
       );
      }

 buttonDelete(){
    return(
      <button id= "delete" value="modifier" onClick={this.handleDeleteClick}>Supprimer</button>
    );
  }

  buttonValidateDelete(){
    return(
      <button value="ok" onClick={this.handleValidateDeleteClick}>Ok</button>
    );
  }

  handleDeleteClick(){
    this.setState(prevState => ({
      isDeletable: true
    }));
    document.getElementById("buttonCreer").style.visibility = "hidden";
    }

 handleValidateDeleteClick(){
    this.setState(prevState => ({
      isDeletable: false
   }));
   document.getElementById("buttonCreer").style.visibility = "visible";
}

  deleteAttribut(key){
    var att=document.getElementById(key).parentElement.getElementsByClassName("Key");
    var id_att= att[0].childNodes[0];
    var tmp = document.createElement("div");
    tmp.appendChild(id_att);
    var attributeClicked = tmp.innerHTML;
    document.getElementById(key).parentElement.remove();
    let hypertopic = new Hypertopic(conf.services);
    const _log = (x) => console.log(JSON.stringify(x, null, 2));
    const _error = (x) => console.error(x.message);

    hypertopic.get({_id:this.props.match.params.item})
       .then(x => {
         delete x[attributeClicked]
         return x;
       })
       .then(hypertopic.post)
       .then(_log)
       .catch(_error);
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
    console.log('this.state', this.state);
    return (
      <div className="DescriptionModality">
        <h3>{this.state.name}</h3>
        <div className="Topics">
          {paths}
          <div className="TopicAdding">
            <Autosuggest
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
            <button
              type="button"
              className="TopicValidateButton"
              onClick={() =>
                this.updatingTopicList(
                  this.state.currentSelection,
                  this.props.id
                )
              }
              disabled={!this.state.canValidateTopic}
              id={`validateButton-${this.state.name}`}>
              ✓
            </button>
            <button
              type="button"
              className="TopicCancelButton"
              onClick={this.clearInput}
              id={`cancelButton-${this.state.name}`}>
              x
            </button>
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
        <button
          type="button"
          className="DeleteTopicButton"
          onClick={this.props.removeTopic}
          id={topicId}>
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
