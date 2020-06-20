import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import by from 'compare-func';
import memoize from 'memoize-one';
import ItemCreator from './ItemCreator.jsx';
import GeographicMap from './GeographicMap.jsx';
import { Items } from '../../model.js';

class Corpora extends Component {

  state = {
    criteria: 'name'
  };

  sort = memoize((items, criteria) => items.sort(by(`${criteria}.0`)));

  render() {
    let itemsData = this.sort(this.props.items, this.state.criteria);
    let items = itemsData.map(x =>
      <Item key={x.id} item={x} />
    );
    let attributes = new Items(this.props.items).getAttributeKeys().sort(by());
    let options = this._getOptions(attributes);
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
          <GeographicMap items={this.props.items} conf={this.props.conf} />
          <div className="selectAttributes">
            <select
              id="attribut"
              onChange={this.handleSort}
              value={this.state.criteria}
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

  handleSort = (e) => {
    this.setState({
      criteria: e.target.value
    });
  }

  _getOptions(arr) {
    return arr.map((attribute) => (
      <option key={attribute} value={attribute}> {attribute} </option>
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
