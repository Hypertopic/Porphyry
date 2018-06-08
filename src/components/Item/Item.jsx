import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import conf from '../../config/config.json';
import '../../styles/App.css';


class Item extends Component {
  constructor() {
    super();
    this.state = {
     topic: [],
      isCreatable: false
    }
    // This binding is necessary to make `this` work in the callback
   this.checkIsCreatable = this.checkIsCreatable.bind(this);
   this.buttonValidate =this.buttonValidate.bind(this);
   this.buttonCreate = this.buttonCreate.bind(this);
  }


  render() {
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
              {!this.state.isCreatable ? this.buttonCreate(): this.buttonValidate()}
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

  buttonValidate(){
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
      const _log = (x) => console.log(JSON.stringify(x, null, 2));
      const _error = (x) => console.error(x.message);
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
   }
}

  _getAttributes(){
    return Object.entries(this.state)
      .filter( x => !["topic", "resource","thumbnail","isCreatable"].includes(x[0]) )
      .map( x =>
        <div className="Attribute" key={x[0]}>
          <div className="Key">{x[0]}</div>
          <div className="Value">{x[1][0]}</div>
        </div>
      );
  }

  _getViewpoints() {
    return Object.entries(this.state.topic).map(v =>
      <Viewpoint key={v[0]} id={v[0]} topics={v[1]} />
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
}

class Viewpoint extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    let paths = this._getPaths();
    return (
      <div className="DescriptionModality">
        <h3>{this.state.name}</h3>
        <div className="Topics">
          {paths}
        </div>
      </div>
    );
  }

  _getPaths() {
    if (!this.state.topics) return [];
    return this.props.topics.map( t =>
      <TopicPath key={t.id} id={t.id} topics={this.state.topics} />
    );
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
  constructor() {
    super();
    this.state = {
      path: []
    };
  }

  render() {
    let topics = this._getTopics();
    return (
      <div className="TopicPath">
        {topics}
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
