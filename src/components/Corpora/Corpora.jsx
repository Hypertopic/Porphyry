import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getConfig from '../../config/config.js';
import ItemCreator from '../Item/ItemCreator.jsx';

// Get the configured list display mode
let listView = getConfig('listView', {
  mode: 'picture',
  name: 'name',
  image: 'thumbnail'
});

class Corpora extends Component {

  render() {
    let items = this._getItems();
    let count = this.props.items.length;
    let total = this.props.from;
    let listIds = this.props.ids.map((item) =>
      <div>{item} <ItemCreator corpus={item} /></div>
    );
    return(
      <div className="col-md-8 p-4">
        <div className="Subject">
          <h2 className="h4 font-weight-bold text-center">
            {listIds}
            <span className="badge badge-pill badge-light ml-4">{count} / {total}</span>
          </h2>
          <div className="Items m-3">
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
  let propList = (listView.props || []).map(key => {
    return <li>{key} : <strong>{getString(item[key])}</strong></li>;
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
      <div className="text-center">{name}</div>
    </div>
  );
}

export default Corpora;
