import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Corpora extends Component {

  render() {
    let items = this._getItems();
    let count = this.props.items.length;
    let total = this.props.from;
    return(
      <div className="col-md-8 p-4">
        <div className="Subject">
          <h2 className="h4 font-weight-bold text-center">
            {this.props.ids.join(' + ')}
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
        <Item key={item.id} name={item.name[0]} thumbnail={item.thumbnail[0]} 
          id={item.corpus+'/'+item.id} />
    ); 
  }

}

function Item(props) {
  let uri = '/item/' + props.id;
  return (
    <div className="Item">
      <Link to={uri}>
        <img src={props.thumbnail} alt={props.name} />
      </Link>
      <div className="text-center">{props.name}</div>
    </div>
  );
}

export default Corpora;
