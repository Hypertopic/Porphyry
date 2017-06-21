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
    }
  }

  render() {
    let selection = this._getSelection();
    let viewpoints = this._getViewpoints(selection);
    let corpora = this._getCorpora(selection);
    let status = this._getStatus(selection);
    return (
      <div className="App">
        <h1>{conf.user}</h1>
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
        this._fetchItems();
        this._fetchViewpoints();
      },
      2000
    );
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

  _getStatus(selection) {
    let topics = selection.map(t => {
      let topic = this._getTopic(t);
      return (topic)? topic.name : 'Thème inconnu';
    });
    return topics.join(' + ') || 'Tous les items';
  }

  _getSelection() {
    let selection = queryString.parse(this.props.location.search).t;
    return (selection instanceof Array)? selection
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

  _isSelected(item, selection) {
    return includes(this._getRecursiveItemTopics(item), selection);
  }

  _getSelectedItems(selection) {
    return this.state.items.filter(e => this._isSelected(e, selection));
  }

  _fetchBookmarks() {
    const hypertopic = new Hypertopic(conf.services);
    hypertopic.getView(`/user/${conf.user}`, (data) => {
      let user = data[conf.user];
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

  _getViewpoints(selection) {
    return this.state.viewpoints.sort(by('name')).map(v =>
      <Viewpoint key={v.id} viewpoint={v} selection={selection} />
    );
  }

  _getCorpora(selection) {
    let selectedItems = this._getSelectedItems(selection);
    let ids = this.state.corpora.map(c => c.id);
    return (
      <Corpora ids={ids} from={this.state.items.length} items={selectedItems} />
    );
  }
}

function includes(array1, array2) {
  let set1 = new Set(array1);
  return array2.map(e => set1.has(e))
    .reduce((c1,c2) => c1 && c2, true);
}

export default Portfolio;
