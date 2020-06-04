import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ItemCreator from './ItemCreator.jsx';
import GeographicMap from './GeographicMap.jsx';

class Corpora extends Component {

  render() {
    let items = this._getItems();
    let attributes = this._getAttributes();
    let options = this._getOptions(attributes);
    let count = this.props.items.length;
    let total = this.props.from;
    let listIds = this.props.ids.map((corpus) =>
      <div key={corpus}>{corpus} <ItemCreator corpus={corpus} conf={this.props.conf} /></div>
    );
    return (
      <div className="col-md-8 p-4">
        <div className="Subject">
          <h2 className="h4 font-weight-bold text-center">
            {listIds}
            <span className="badge badge-pill badge-light ml-4">{count} / {total}</span>
          </h2>
          <GeographicMap items={this.props.items} conf={this.props.conf} />
          <div className="selectAttributes">
            <select
              id="attribut"
              onChange={this.props.onSort}
              value={this.props.sortAttribute}
            >
              {options}
            </select>
          </div>
          <div className="Items m-3">
            {items}
          </div>
        </div>
      </div>
    );
  }

  _getItems() {
    return this.props.items.map(item =>
      <Item key={item.id} item={item} />
    );
  }

  _getAttributes() {
    let arr = [];
    let rejectedAttributes = ['couchapp', 'topic', 'corpus', 'id', 'item'];
    this.props.items.forEach(element => arr = arr.concat(Object.keys(element)));
    arr = arr.filter((value, index, self) => self.indexOf(value) === index && !rejectedAttributes.includes(value));
    arr.sort();
    return arr;
  }

  _getOptions(arr) {
    return arr.map((attribute) => (
      <option value={attribute}> {attribute} </option>
    ));
  }
}

function Item(props) {
  let uri = `/item/${props.item.corpus}/${props.item.id}`;
  let thumbnail = props.item.thumbnail;
  let name = [props.item.name].join(', '); //Name can be an array
  if (thumbnail) return (
    <div className="Item">
      <Link to={uri}>
        <img src={thumbnail} alt={name}/>
      </Link>
      <div className="text-center">{name}</div>
    </div>
  );
  return (
    <div className="Item">
      <Link to={uri}>
        {name}
      </Link>
    </div>
  );
}

export default Corpora;
