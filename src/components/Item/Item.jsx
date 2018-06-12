import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import FacebookProvider, { Comments } from 'react-facebook';
import conf from '../../config/config.json';

import '../../styles/App.css';

class Item extends Component {
  constructor() {
    super();
    this.resource_old = false;
    this.state = {
      topic: [],
    }
  }

  render() {
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();
    let comment = this._getFacebookComment();
    return (
      <div className="App">
        <h1>{this.state.name}</h1>
        <div className="Status">Item</div>
        <div className="App-content">
          <div className="Description">
            <div className="DescriptionModality">
              <h3>Attributs du document</h3>
              <div className="Attributes">
                {attributes}
              </div>
            </div>
            {viewpoints}
            {comment}
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
      .filter( x => !["topic", "resource","thumbnail"].includes(x[0]) )
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

  _getFacebookComment(){
    let c_url = String(this.state.resource);
    /*
    console.log(c_url);
    console.log(this.resource_old);
    if(this.resource_old==c_url){
      c_url = this.resource_old;
    }
    else{
      this.resource_old = c_url;
    }
    */
    return (
      <FacebookProvider appId="566160170436215">
        <Comments href={c_url} />
      </FacebookProvider>
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
