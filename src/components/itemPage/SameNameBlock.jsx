import React, { Component } from 'react';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import { Trans } from '@lingui/macro';

class SameNameBlock extends Component {

  constructor() {
    super();
    this.state = {
      sameNameItemsList: []
    };
  }

  render() {
    let items = this._getItems();
    if (this.state.sameNameItemsList.length > 0) {
      return (
        <div className="Description">
          <h2 className="h4 font-weight-bold text-center d-none d-sm-block"><Trans>Items ayant le même nom</Trans></h2>
          <div className="Items m-0 m-md-3">
            {items}
          </div>
        </div>
      );
    }
    return (
      <hr className="space d-none d-md-block" />
    );
  }

  _fetchSameNameItems = async () => {
    let SETTINGS = await conf;
    let hypertopic = new Hypertopic(SETTINGS.services);
    return hypertopic.getView(`/user/${SETTINGS.user}`)
      .then(data => {
        let user = data[SETTINGS.user] || {};
        user = {
          corpus: user.corpus || []
        };
        return user;
      })
      .then(x =>
        x.corpus.map(y => `/corpus/${y.id}`)
      )
      .then(hypertopic.getView)
      .then((data) => this._SameName(data));
  }

  _SameName = (data) => {
    let itemName = this.props.itemName.toString();
    let sameNameItemsList = [];
    for (let corpusID in data) {
      let currentCorpus = data[corpusID];
      for (let itemID in currentCorpus) {
        let currentItem = currentCorpus[itemID];
        if (typeof(currentItem) === 'object') {
          currentItem.id = itemID;
          currentItem.corpus = corpusID;
          if (Array.isArray(currentItem.name) && currentItem.name !== undefined) {
            let currentItemName = currentItem.name.toString();
            if (currentItemName === itemName && currentItemName !== undefined && currentItem.id !== this.props.ID) {
              sameNameItemsList.push(currentItem);
            }
          }
        }
      }
    }
    this.setState({sameNameItemsList});
  }

  componentDidMount() {
    this._fetchSameNameItems();
  }

  _getItems() {
    return this.state.sameNameItemsList.map(item =>
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
      <a href={uri}>
        <img src={thumbnail} alt={name}/>
      </a>
    </div>
  );
  return (
    <div className="Item">
      <a href={uri}>
        {name}
      </a>
    </div>
  );
}

export default SameNameBlock;
