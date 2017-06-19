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
      viewpoint: [],
      corpus: [],
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
      () => this._fetchItems(),
      2000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _fetchBookmarks() {
    const hypertopic = new Hypertopic(conf.services);
    hypertopic.getView(`/user/${conf.user}`, (data) => {
      this.setState(data[conf.user]);
    });
  }

  _fetchItems() {
    let hypertopic = new Hypertopic(conf.services);
    let uris = this.state.corpus.map(c => '/corpus/' + c.id);
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

  _getViewpoints() {
    return this.state.viewpoint.sort(by('name')).map(v => 
      <Viewpoint key={v.id} id={v.id} name={v.name} />
    );
  }

  _getCorpora() {
    let ids = this.state.corpus.map(c => c.id);
    return (
      <Corpora ids={ids} items={this.state.items} />
    );
  }
}

export default Portfolio;
