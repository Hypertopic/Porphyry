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
     isClick: false,
     topic: []
    }
    // This binding is necessary to make this work in the callback
    this.handleModifierClick = this.handleModifierClick.bind(this);
    this.handleValiderClick = this.handleValiderClick.bind(this);
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
              <h3>Attributs du document
              {this.state.isClick ?  this.validerButton() : this.modifierButton()}
              </h3>
              <div className="Attributes">

               {attributes}
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

      .filter( x => !["topic", "resource","thumbnail","isClick"].includes(x[0]) )
      .map( x =>
        <div className="Attribute" key={x[0]}>
          <div className="Key">{x[0]}</div>
          <div className="Value">{x[1][0]}</div>
          {this.state.isClick ? this.getForm(x[0].concat("Button")) : ""}
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

  getForm(key){
     return(
       <button id={key} value="delete" onClick={this.deleteAttribut.bind(this,key)}>X</button>
       );
      }

  modifierButton(){
    return(
      <button value="modifier" onClick={this.handleModifierClick}>Modifier</button>
    );
  }

  handleModifierClick(){

    this.setState(prevState => ({
    isClick: true
 }));
    }

  validerButton(){
    return(
      <button value="ok" onClick={this.handleValiderClick}>Ok</button>
    );
  }

  handleValiderClick(){
      this.setState(prevState => ({
     isClick: false
   }));
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
