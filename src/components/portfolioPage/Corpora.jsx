import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ItemCreator from './ItemCreator.jsx';

class Corpora extends Component {

  render() {
    let items = this._getItems();
    let count = this.props.items.length;
    let total = this.props.from;
    let listIds = this.props.ids.map((corpus) =>
      <div key={corpus}>{corpus} <ItemCreator corpus={corpus} conf={this.props.conf} /></div>
    );
    return (
      <div className="col-md-8 p-4">
        <div className="Subject">
          <h2 className="h4 font-weight-bold text-center d-none d-sm-block">
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
      <Item key={item.id} item={item} />
    );
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
