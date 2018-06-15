import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getConfig from '../../config/config.js';

// Get the configured list display mode
let listView = getConfig('listView', {
  mode: 'picture',
  name: 'name',
  image: 'thumbnail'
});

class Corpora extends Component {

  render() {
    let items = this._getItems();
    return(
      <div className="Subject">
        <div>
          <h3>{this.props.ids.join(' + ')} ({this.props.items.length}/{this.props.from})</h3>
          <div className="Items">
            {items}
          </div>
        </div>
      </div>
    );
  }

  _getItems() {
    return this.props.items.map(item =>
        <Item key={item.id} item={item}
          id={item.corpus+'/'+item.id} />
    );
  }

}

function Item(props) {
  switch (listView.mode) {
  case 'article':
    return Article(props.item);
  case 'picture':
    return Picture(props.item);
  default:
    return Picture(props.item);
  }
}

function getString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(val => getString(val)).join(', ');
  }
  return String(obj);
}

function Article(item) {
  let propList = listView.props.map(key => {
    return <li><strong>{key}</strong>: {getString(item[key])}</li>;
  });

  let uri = `/item/${item.corpus}/${item.id}`;
  let name = getString(item[listView.name]);
  return (
    <div className="Article">
      <div className="ArticleTitle"><Link to={uri}>{name}</Link></div>
      <ul>{propList}</ul>
    </div>
  );
}

function Picture(item) {
  let uri = `/item/${item.corpus}/${item.id}`;
  let img = getString(item[listView.image]);
  let name = getString(item[listView.name]);
  return (
    <div className="Item">
      <Link to={uri}>
        <img src={img} alt={name}/>
      </Link>
      <div>{name}</div>
    </div>
  );
}

export default Corpora;
