import React, { Component } from 'react';
import by from 'sort-by';
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
    const viewpoints = this._getViewpoints();
    const corpora = this._getCorpora();
    return (
      <div className="App">
        <h1>{conf.user}</h1>
        <div className="Status">Tous les items</div>
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

  _getViewpoints() {
    return this.state.viewpoints.sort(by('name')).map(v =>
      <Viewpoint key={v.id} viewpoint={v} />
    );
  }

  _getCorpora() {
    let ids = this.state.corpora.map(c => c.id);
    return (
      <Corpora ids={ids} items={this.state.items} />
    );
  }
}

export default Portfolio;
