import React, { Component } from 'react';
import by from 'compare-func';
import queryString from 'query-string';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import Viewpoint from './Viewpoint.jsx';
import Corpora from './Corpora.jsx';
import Header from '../Header.jsx';
import Status from './Status.jsx';
import SearchBar from './SearchBar.jsx';
import ViewpointCreator from './ViewpointCreator.jsx';
import { Trans } from '@lingui/macro';
import { Items } from '../../model.js';

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
    this._updateSelection();
  }

  render() {
    let viewpoints = this._getViewpoints();
    let corpora = this._getCorpora();
    let attributes = new Items(this.state.items)
      .getAttributes()
      .map(([key, value]) => key.concat(' : ', value))
      .map(x => ({[x]: {name: x}}));
    let candidates = this.state.viewpoints.concat(attributes);
    return (
      <div className="App container-fluid">
        <Header conf={conf} />
        <div className="Status row align-items-center h5">
          <div className="Search col-md-3">
            <SearchBar viewpoints={this.state.viewpoints} items={this.state.items} />
          </div>
          <div className="col-md-6">
            <Status selectionJSON={this.selectionJSON} candidates={candidates} />
          </div>
        </div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4 d-none d-sm-block">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center"><Trans>Points de vue</Trans></h2>
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

  hasChanged = async () => new Hypertopic((await conf).services)
    .get({_id: ''})
    .then(x =>
      x.update_seq !== this.update_seq && (this.update_seq = x.update_seq)
    );

  componentDidMount() {
    let start = new Date().getTime();
    this.hasChanged().then(() => {
      this._fetchAll().then(() => {
        let end = new Date().getTime();
        let elapsedTime = end - start;
        console.log('elapsed time ', elapsedTime);
        let intervalTime = Math.max(10000, elapsedTime * 5);
        console.log('reload every ', intervalTime);
        this._timer = setInterval(
          async () => {
            this.hasChanged().then(x => {
              if (x) this._fetchAll();
            });
          },
          intervalTime
        );
      });
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

  _updateSelection() {
    try {
      this.selectionJSON = JSON.parse(queryString.parse(window.location.search).t);
    } catch (e) {
      this.selectionJSON = {
        type: 'intersection',
        data: []
      };
    }
    this.selection = (this.selectionJSON.hasOwnProperty('data'))? this.selectionJSON.data.map(s => (s.selection === undefined)?[]:s.selection).flat():[];
    this.exclusion = (this.selectionJSON.hasOwnProperty('data'))? this.selectionJSON.data.map(s => (s.exclusion === undefined)?[]:s.exclusion).flat():[];
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

  _getItemAttributes(item) {
    return new Items(
      [item]
    ).getAttributes()
      .map(([key, value]) => key.concat(' : ', value));
  }

  _isSelected(item, list) {
    let itemHasValue = list.data.map(l => includes(this._getRecursiveItemTopics(item).concat(this._getItemAttributes(item)), (l.selection || [] ), (l.exclusion || []), (l.type === 'union')));
    if (list.type === 'union')
      return itemHasValue.reduce((c1, c2) => c1 || c2, false);
    return itemHasValue.reduce((c1, c2) => c1 && c2, true);
  }

  _updateSelectedItems() {
    let selectedItems;
    if (this.selectionJSON.data.length > 0)
      selectedItems = this.state.items.filter(e => this._isSelected(e, this.selectionJSON));
    else
      selectedItems = this.state.items;
    let topicsItems = new Map();
    for (let e of selectedItems) {
      for (let t of this._getRecursiveItemTopics(e)) {
        push(topicsItems, t, e.id);
      }
    }
    this.setState({selectedItems, topicsItems});
  }

  async _fetchUser(SETTINGS, hypertopic) {
    return hypertopic.getView(`/user/${SETTINGS.user}`)
    .then(data => {
      let user = data[SETTINGS.user] || {};
      user = {
        viewpoint: user.viewpoint || [],
        corpus: user.corpus || []
      };
      if (!this.state.viewpoints.length && !this.state.corpora.length) { //TODO compare old and new
        this.setState({ viewpoints: user.viewpoint, corpora: user.corpus });
      }
      return user;
    });
  }

  async _fetchViewpoints(hypertopic, user) {
    return hypertopic.getView(user.viewpoint.map(x => `/viewpoint/${x.id}`))
    .then(data => {
      let viewpoints = [];
      for (let v of this.state.viewpoints) {
        let viewpoint = data[v.id];
        viewpoint.id = v.id;
        viewpoints.push(viewpoint);
      }
      this.setState({viewpoints});
      return data;
    });
  }

  async _fetchItems(hypertopic) {
    return hypertopic.getView(this.state.corpora.map(x => `/corpus/${x.id}`))
    .then(data => {
      let items = [];
      for (let corpus of this.state.corpora) {
        for (let itemId in data[corpus.id]) {
          if (!['id', 'name', 'user'].includes(itemId)) {
            let item = data[corpus.id][itemId];
            if (!item.name || !item.name.length) {
              console.log(`/item/${corpus.id}/${itemId} has no name!`);
            } else {
              item.id = itemId;
              item.corpus = corpus.id;
              items.push(item);
            }
          }
        }
      }
      this.setState({items});
    });
  }

  async _fetchAll() {
    let SETTINGS = await conf;
    let hypertopic = new Hypertopic(SETTINGS.services);

    return this._fetchUser(SETTINGS, hypertopic)
    .then(x => Promise.all([this._fetchViewpoints(hypertopic, x), this._fetchItems(hypertopic)]))
    .then(() => this._updateSelectedItems());
  }

  _getViewpoints() {
    return this.state.viewpoints.sort(by('name')).map((v, i) =>
      <div key={v.id}>
        {i > 0 && <hr/>}
        <Viewpoint viewpoint={v} selection={this.selection} exclusion={this.exclusion} selectionJSON={this.selectionJSON}
          topicsItems={this.state.topicsItems} />
      </div>
    );
  }

  _getCorpora() {
    let ids = this.state.corpora.map(c => c.id);
    return (
      <Corpora
        ids={ids}
        from={this.state.items.length}
        items={this.state.selectedItems}
        conf={conf}
      />
    );
  }
}
function includes(array1, array2, array3, union) {
  let set1 = new Set(array1);
  let arrayHasValue = array2.map(e => set1.has(e));
  let arrayDontHaveValue = array3.map(e => set1.has(e));
  if (union)
    return arrayHasValue.reduce((c1, c2) => c1 || c2, false) || ((array3.length > 0)?!arrayDontHaveValue.reduce((c1, c2) => c1 || c2, false):false);
  return arrayHasValue.reduce((c1, c2) => c1 && c2, true) && ((array3.length > 0)?!arrayDontHaveValue.reduce((c1, c2) => c1 && c2, true):true);
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
