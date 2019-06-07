import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import by from 'sort-by';
import queryString from 'query-string';
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
import Viewpoint from '../Viewpoint/Viewpoint.jsx';
import Corpora from '../Corpora/Corpora.jsx';
import Header from '../Header/Header.jsx';
import ViewpointCreator from '../Viewpoint/ViewpointCreator.jsx';
import Authenticated from '../Authenticated/Authenticated.jsx';

import '../../styles/App.css';

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      viewpoints: [],
      corpora: [],
      items: [],
      selectedItems: [],
      topicsItems: new Map()
    };
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
    this._updateSelection();
  }

  render() {
    let viewpoints = this._getViewpoints();
    let corpora = this._getCorpora();
    let status = this._getStatus();
    return (
      <div className="App container-fluid">
        <Header />
        <div className="Status row h5 text-center">
          <Authenticated/>
          {status}
        </div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">Points de vue</h2>
                <div className="p-3">
                  <ViewpointCreator />
                  {viewpoints}
                </div>
              </div>
            </div>
            {corpora}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    let start=new Date().getTime();
    var self=this;
    this._fetchAll().then(() => {
      let end=new Date().getTime();
      let elapsedTime=end-start;
      console.log("elapsed Time ",elapsedTime);

      let intervalTime=Math.max(10000,elapsedTime*5);
      console.log("reload every ",intervalTime);
      self._timer = setInterval(
        () => {
          self._fetchAll();
        },
        intervalTime
      );
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this._updateSelection();
      this._updateSelectedItems();
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
      if (!topic) {
          return 'Thème inconnu';
      }
      let uri = '?' + queryString.stringify({
        t: this._toggleTopic(this.selection, t),
          e: this.exclusion
      });
      let excludeUri = '?' + queryString.stringify({
        t: this._toggleTopic(this.selection, t),
          e: this._toggleTopic(this.exclusion, t)
      });
      return <span className="badge badge-pill badge-light TopicTag">
        {topic.name} <Link to={excludeUri} className="badge badge-pill badge-dark oi oi-minus" title="Exclure"> </Link><Link to={uri} className="badge badge-pill badge-dark oi oi-x" title="Déselectionner"> </Link>
      </span>;
    });
    if (this.exclusion.length)
        topics.push(this.exclusion.map(t => {
            let topic = this._getTopic(t);
            if (!topic) {
                return 'Thème inconnu';
            }
            let uri = '?' + queryString.stringify({
                t: this.selection,
                e: this._toggleTopic(this.exclusion, t)
            });
            let includeUri = '?' + queryString.stringify({
                t: this._toggleTopic(this.selection, t),
                e: this._toggleTopic(this.exclusion, t)
            });
            return <span className="badge badge-pill badge-light TopicTag text-danger">
            {topic.name} <Link to={includeUri} className="badge badge-pill badge-dark oi oi-plus" title="Inclure"> </Link><Link to={uri} className="badge badge-pill badge-dark oi oi-x" title="Déselectionner"> </Link>
          </span>;
        }));
    return (topics.length) ? topics : 'Tous les items';
  }

  _toggleTopic(array, item) {
    let s = new Set(array);
    if (!s.delete(item)) {
      s.add(item);
    }
    return [...s];
  }

  _updateSelection() {
    let selection = queryString.parse(window.location.search).t;
    this.selection = (selection instanceof Array)? selection
      : (selection)? [selection]
      : [];
    let exclusion = queryString.parse(window.location.search).e;
    this.exclusion = (exclusion instanceof Array)? exclusion
      : (exclusion)? [exclusion]
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

  _isSelected(item, list, union = false) {
    return includes(this._getRecursiveItemTopics(item), list, union);
  }

  _updateSelectedItems() {
    let selectedItems = this.state.items
      .filter(e => this._isSelected(e, this.selection) && ((this.exclusion.length > 0)?!this._isSelected(e, this.exclusion, true):true));
    let topicsItems = new Map();
    for (let e of selectedItems) {
      for (let t of this._getRecursiveItemTopics(e)) {
        push(topicsItems, t, e.id);
      }
    }
    this.setState({selectedItems, topicsItems});
  }

  _fetchAll() {
    const hypertopic = new Hypertopic(conf.services);
    return hypertopic.getView(`/user/${this.user}`)
      .then(data => {
        let user = data[this.user] || {};
        user = {
          viewpoint: user.viewpoint || [],
          corpus: user.corpus || []
        };
        if (!this.state.viewpoints.length && !this.state.corpora.length) { //TODO compare old and new
          this.setState({viewpoints:user.viewpoint, corpora:user.corpus});
        }
        return user;
      })
      .then(x =>
        x.viewpoint.map(y => `/viewpoint/${y.id}`)
          .concat(x.corpus.map(y => `/corpus/${y.id}`))
      )
      .then(hypertopic.getView)
      .then(data => {
        let viewpoints = [];
        for (let v of this.state.viewpoints) {
          let viewpoint = data[v.id];
          viewpoint.id = v.id;
          viewpoints.push(viewpoint);
        }
        this.setState({viewpoints});
        return data;
      })
      .then(data => {
        let items = [];
        for (let corpus of this.state.corpora) {
          for (let itemId in data[corpus.id]) {
            if (!['id','name','user'].includes(itemId)) {
              let item = data[corpus.id][itemId];
              if (!item.name || !item.name.length || !item.thumbnail || !item.thumbnail.length) {
                console.log(itemId, "has no name or thumbnail!", item);
              } else {
                item.id = itemId;
                item.corpus = corpus.id;
                items.push(item);
              }
            }
          }
        }
        this.setState({items:items.sort(by('name'))});
      })
      .then(x => {
        this._updateSelectedItems();
      });
  }

  _getViewpoints() {
    return this.state.viewpoints.sort(by('name')).map((v, i) =>
      <div key={v.id}>
        {i > 0 && <hr/>}
        <Viewpoint viewpoint={v} selection={this.selection} exclusion={this.exclusion}
          topicsItems={this.state.topicsItems} />
      </div>
    );
  }

  _getCorpora() {
    let ids = this.state.corpora.map(c => c.id);
    return (
      <Corpora ids={ids} from={this.state.items.length} items={this.state.selectedItems} />
    );
  }
}

function includes(array1, array2, union) {
  let set1 = new Set(array1);
  let arrayHasValue = array2.map(e => set1.has(e));
  if (union)
   return arrayHasValue.reduce((c1,c2) => c1 || c2, false);
  else
    return arrayHasValue.reduce((c1,c2) => c1 && c2, true);
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
