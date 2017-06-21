import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
      <div>{props.name}</div>
    </div>
  );
}

export default Corpora;
