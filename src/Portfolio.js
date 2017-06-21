import React, { Component } from 'react';
import by from 'sort-by';
import queryString from 'query-string';
import Hypertopic from 'hypertopic';
import conf from './config.json';
import Viewpoint from './Viewpoint';
import Corpora from './Corpora';

import './App.css';

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      viewpoints: [],
      corpora: [],
      items: []
    };
    this.user = conf.user || location.hostname.split('.', 1)[0];
    this._updateSelection();
    this.selectedItems = [];
    this.topicsItems = new Map();
  }

  render() {
    console.log('RENDER');
    let viewpoints = this._getViewpoints();
    let corpora = this._getCorpora();
    let status = this._getStatus();
    return (
      <div className="App">
        <h1>{this.user}</h1>
        <div className="Status">{status}</div>
        <div className="App-content">
          <div className="Description">
            {viewpoints}
          </div>
          {corpora}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._fetchBookmarks();
    this._timer = setInterval(
      () => {
        console.log('FETCH');
        this._fetchItems();
        this._fetchViewpoints();
        this._updateSelectedItems();
        this._updateTopicsItems();
      },
      2000
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      console.log('UPDATE');
      this._updateSelection();
      this._updateSelectedItems();
      this._updateTopicsItems();
    }
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _getTopic(id) {
    for (let v of this.state.viewpoints) {
      if (v[id]) return v[id];
    }
    return null;
  }

  _getStatus() {
    let topics = this.selection.map(t => {
      let topic = this._getTopic(t);
      return (topic)? topic.name : 'Thème inconnu';
    });
    return topics.join(' + ') || 'Tous les items';
  }

  _updateSelection() {
    let selection = queryString.parse(location.search).t;
    this.selection = (selection instanceof Array)? selection
      : (selection)? [selection]
      : [];
  }

  _getTopicPath(topicId) {
    let topic = this._getTopic(topicId);
    let path = (topic && topic.broader)? this._getTopicPath(topic.broader[0].id) : [];
    path.push(topicId);
    return path;
  }

  _getItemTopicsPaths(item) {
    return (item.topic||[]).map(t => this._getTopicPath(t.id));
  }

  _getRecursiveItemTopics(item) {
    return Array.prototype.concat(...this._getItemTopicsPaths(item));
  }

  _isSelected(item) {
    return includes(this._getRecursiveItemTopics(item), this.selection);
  }

  _updateSelectedItems() {
    this.selectedItems = this.state.items.filter(e => this._isSelected(e, this.selection));
  }

  _updateTopicsItems() {
    this.topicsItems = new Map();
    for (let e of this.selectedItems) {
      for (let t of this._getRecursiveItemTopics(e)) {
        push(this.topicsItems, t, e.id);
      }
    }
  }

  _fetchBookmarks() {
    const hypertopic = new Hypertopic(conf.services);
    hypertopic.getView(`/user/${this.user}`, (data) => {
      let user = data[this.user];
      this.setState({
        viewpoints: user.viewpoint,
        corpora: user.corpus
      });
    });
  }

  _fetchItems() {
    let hypertopic = new Hypertopic(conf.services);
    let uris = this.state.corpora.map(c => '/corpus/' + c.id);
    hypertopic.getView(uris, (data) => {
      let items = [];
      for (let corpus in data) {
        for (let itemId in data[corpus]) {
          if (!['id','name','user'].includes(itemId)) {
            let item = data[corpus][itemId];
            if (!item.name || !item.name.length || !item.thumbnail || !item.thumbnail.length) {
              console.log(itemId, "has no name or thumbnail!", item);
            } else {
              item.id = itemId;
              item.corpus = corpus;
              items.push(item);
            }
          }
        }
      }
      this.setState({items:items.sort(by('name'))});
    });
  }

   _fetchViewpoints() {
      let hypertopic = new Hypertopic(conf.services);
      let uris = this.state.viewpoints.map(v => '/viewpoint/' + v.id);
      hypertopic.getView(uris, (data) => {
        let viewpoints = [];
        for (let [id, v] of Object.entries(data)) {
          v.id = id;
          viewpoints.push(v);
        }
        this.setState({viewpoints});
      });
   }

  _getViewpoints() {
    return this.state.viewpoints.sort(by('name')).map(v =>
      <Viewpoint key={v.id} viewpoint={v} selection={this.selection}
        topicsItems={this.topicsItems} />
    );
  }

  _getCorpora() {
    let ids = this.state.corpora.map(c => c.id);
    return (
      <Corpora ids={ids} from={this.state.items.length} items={this.selectedItems} />
    );
  }
}

function includes(array1, array2) {
  let set1 = new Set(array1);
  return array2.map(e => set1.has(e))
    .reduce((c1,c2) => c1 && c2, true);
}

function push(map, topicId, itemId) {
  let old = map.get(topicId);
  if (old) {
    map.set(topicId, old.add(itemId));
  } else {
    map.set(topicId, new Set([itemId]));
  }
}

export default Portfolio;
