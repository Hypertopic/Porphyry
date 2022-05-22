import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
import VisitMap from './VisitMap.jsx';
import { Trans } from '@lingui/macro';
import { Items } from '../../model.js';
import Selection from '../../Selection.js';

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      viewpoints: [],
      corpora: [],
      items: [],
      selectedItems: [],
      topicsItems: new Map(),
      visitMap: false
    };
    this._updateSelection();
    conf.then(settings => {
      if (settings.portfolio && settings.portfolio[settings.user])
        this.setState({
          visitMap: settings.portfolio[settings.user].visitMap || false,
        });
    });
  }

  render() {
    let viewpoints = this._getViewpoints();
    let attributes = new Items(this.state.items)
      .getAttributes()
      .map(([key, value]) => key.concat(' : ', value))
      .map(x => ({[x]: {name: x}}));
    let candidates = this.state.viewpoints.concat(attributes);
    const urlParams = new URLSearchParams(window.location.search);
    const selectionJSON = JSON.parse(urlParams.get('t'));
    // Normal items have numbers in their names, but building maps don't,
    // so the regex only matches building maps.
    const maybeBuildingMap = this.state.selectedItems.find(x => /^[A-Z]+$/.test(x.name[0]));
    const visitPossible = this.state.visitMap
      && maybeBuildingMap !== undefined
      && selectionJSON
      && selectionJSON.type === 'intersection'
      && selectionJSON.data.length === 1
      && selectionJSON.data[0].type === 'intersection'
      && selectionJSON.data[0].selection.length === 1
      && selectionJSON.data[0].exclusion.length === 0
      && /^spatial : /.test(selectionJSON.data[0].selection[0]);
    return (
      <div className="App container-fluid px-0 px-md-2">
        <Header conf={conf} />
        <div className="Status row align-items-center h5 mb-0 mb-md-2">
          <div className="Search col-md-3">
            <SearchBar viewpoints={this.state.viewpoints} items={this.state.items} />
          </div>
          <div className="col-md-6">
            <Status candidates={candidates} query={this.query} />
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
            {visitPossible ? <VisitMap items={this.state.selectedItems} map={maybeBuildingMap} /> : this._getCorpora()}
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
      this.query = new Selection();
      let json = queryString.parse(window.location.search).t;
      this.query.setJSON(json);
    } catch (e) {
    }
  }

  _getTopicPath(topicId) {
    let topic = this._getTopic(topicId);
    let path = (topic && topic.broader) ? this._getTopicPath(topic.broader[0].id) : [];
    path.push(topicId);
    return path;
  }

  _getItemTopicsPaths(item) {
    return (item.topic || []).map(t => this._getTopicPath(t.id));
  }

  _getRecursiveItemTopics(item) {
    return Array.prototype.concat(...this._getItemTopicsPaths(item));
  }

  _getItemAttributes(item) {
    return new Items(
      [item]
    ).getAttributes()
      .map(([key, value]) => key.concat(' : ', value.replace('\'', '’')));
  }

  _isSelected(item) {
    let filter = this.query.toFilter();
    return filter(this._getRecursiveItemTopics(item).concat(this._getItemAttributes(item)));
  }

  _updateSelectedItems() {
    let selectedItems;
    if (!this.query.isEmpty())
      selectedItems = this.state.items.filter(e => this._isSelected(e));
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
        <Viewpoint viewpoint={v}
          query={this.query}
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

function push(map, topicId, itemId) {
  let old = map.get(topicId);
  if (old) {
    map.set(topicId, old.add(itemId));
  } else {
    map.set(topicId, new Set([itemId]));
  }
}
export default withRouter(Portfolio);
