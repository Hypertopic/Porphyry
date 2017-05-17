import React, { Component } from 'react';
import by from 'sort-by';
import Hypertopic from 'hypertopic';
import conf from './config.json';

class Corpora extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    };
  }

  render() {
    let items = this._getItems();
    return(
      <div className="Corpora">
        <h3>{this.props.ids.join(' + ')} ({this.state.items.length})</h3>
        <div className="Items">
          {items}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._timer = setInterval(
      () => this._fetchItems(),
      15000
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) this._fetchItems();
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _getItems() {
    return this.state.items.map(item => 
        <Item key={item.id} name={item.name[0]} thumbnail={item.thumbnail[0]} 
          resource={item.resource[0]} />
    ); 
  }

  _fetchItems() {
    const hypertopic = new Hypertopic(conf.services);
    let uris = this.props.ids.map(id => '/corpus/' + id);
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
}

function Item(props) {
  return (
    <div className="Item">
      <a href={props.resource}>
        <img src={props.thumbnail} alt={props.name} />
      </a>
      <div>{props.name}</div>
    </div>
  );
}

export default Corpora;
