import React, { Component } from 'react';
import by from 'compare-func';
import queryString from 'query-string';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import Viewpoint from '../portfolioPage/Viewpoint.jsx';
import Corpora from '../portfolioPage/Corpora.jsx';
import Header from '../Header.jsx';
import Status from '../portfolioPage/Status.jsx';
import SearchBar from '../portfolioPage/SearchBar.jsx';
import { Trans } from '@lingui/macro';
import { Items } from '../../model.js';
import { Link } from 'react-router-dom';

class RSS extends Component {
  constructor() {
    super();
    this.state = {
      viewpoints: [],
      corpora: [],
      items: [],
      selectedItems: [],
      topicsItems: new Map(),
      services: [],
      corpusSelected: '',
      linkRss: ''
    };
    this._updateSelection();
    conf.then(x => {
      this.setState({services: x.services});
    });
  }

  render() {
    let viewpoints = this._getViewpoints();
    let corpora = this._getCorpora();
    let [linkRss, multiCorpus] = this._getRssLinks();
    let tempLinkRss = linkRss.length > 1 ? linkRss[0] : linkRss;
    let attributes = new Items(this.state.items)
      .getAttributes()
      .map(([key, value]) => key.concat(' : ', value))
      .map(x => ({[x]: {name: x}}));
    let candidates = this.state.viewpoints.concat(attributes);
    return (
      <div className="App container-fluid">
        <Header conf={conf} />
        <div className="container-fluid ">
          <div className="App-content row justify-content-center">
            <div className="col-sm-9 col-md-10 col-lg-6 col-xl-4 col-xxl-4 p-4">
              <div className="Description">
                <h2 className="h4 text-center"><Trans>Flux RSS</Trans></h2>
                <div className="p-3">
                  <div className="col-sm-9 col-md-10 col-lg-3 col-xl-3 col-xxl-3">
                    <select className="form-select form-select-lg mb-3" onChange={(e)=> this._setRssLink(e.target.value)}>
                      {multiCorpus.map(corpus =>
                        <option value={corpus} key={corpus}>{corpus}</option>
                      )}
                    </select>
                  </div>
                  <div className="row justify-content-around">
                    <button className="btn btn-light creationButton" onClick={this._openRssWindows.bind(this, tempLinkRss)}>
                      <Trans>S'abonner à un corpus</Trans>
                    </button>
                    <Link to="/rss/topic">
                      <button className="btn btn-light creationButton" >
                        <Trans>S'abonner à un catégorie</Trans>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-weight-bold p-1">
                    <Trans>Qu'est-ce qu'un flux RSS ?</Trans>
                  </div>
                  <div className="ExplicativeText">
                    <Trans>Les flux RSS sont des fils de contenus . Chaque flux correspond à une rubrique ou une sous-rubrique du site. En vous abonnant à un flux, vous recevrez automatiquement le titre, auteur, et informations importantes des derniers items ajoutés ou modifiés.</Trans>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-weight-bold p-1">
                    <Trans>Comment utiliser les flux RSS ?</Trans>
                  </div>
                  <div className="ExplicativeText">
                    <Trans>Pour pouvoir utiliser les flux RSS, plusieurs solutions existent. Vous pouvez utiliser un agrégateur de flux, via un site web ou une application mobile, comme FlipBoard, Feedly, Netvibes, In oreader ou encore News Blur. Alternativament, un lecteur RSS peut être installé directement sur votre navigateur web.</Trans>
                  </div>
                </div>
              </div>
            </div>
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

    _openRssWindows(tempRssLink) {
      if (this.state.linkRss !== '') {
        window.open(this.state.linkRss);
      } else {
        window.open(tempRssLink);
      }
    }

    _setRssLink(value) {
      let servicePrincipal = this.state.services[0];
      let origin = window.location.origin;
      let linkRss = `${servicePrincipal}/feed/${encodeURI(value)}?app=${origin}`;
      this.setState({linkRss});
    }

    _getRssLinks() {
      let servicePrincipal = this.state.services[0];
      let corpora = this._getCorpora();
      let ids = corpora.props.ids;
      let multiCorpus = ids.map(id => encodeURI(id));
      let origin = window.location.origin;
      let linkRss = multiCorpus.map(corpus => `${servicePrincipal}/feed/${corpus}?app=${origin}`);
      return [linkRss, ids];
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
      this.selection = (this.selectionJSON.hasOwnProperty('data'))
        ? this.selectionJSON.data.map(s => (s.selection === undefined)
          ? []
          : s.selection).flat()
        : [];
      this.exclusion = (this.selectionJSON.hasOwnProperty('data'))
        ? this.selectionJSON.data.map(s => (s.exclusion === undefined)
          ? []
          : s.exclusion).flat()
        : [];
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
        .map(([key, value]) => key.concat(' : ', value));
    }

    _isSelected(item, list) {
      let itemHasValue = list.data.map(l => includes(this._getRecursiveItemTopics(item).concat(this._getItemAttributes(item)), (l.selection || []), (l.exclusion || []), (l.type === 'union')));
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
    return arrayHasValue.reduce((c1, c2) => c1 || c2, false)
            || ((array3.length > 0)
              ? !arrayDontHaveValue.reduce((c1, c2) => c1 || c2, false)
              : false
            );
  return arrayHasValue.reduce((c1, c2) => c1 && c2, true)
        && ((array3.length > 0)
          ? !arrayDontHaveValue.reduce((c1, c2) => c1 && c2, true)
          : true
        );
}

function push(map, topicId, itemId) {
  let old = map.get(topicId);
  if (old) {
    map.set(topicId, old.add(itemId));
  } else {
    map.set(topicId, new Set([itemId]));
  }
}
export default RSS;
