import React, { Component } from 'react';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';

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
          <h2 className="h4 font-weight-bold text-center">Items ayant le même nom</h2>
          <div className="Items m-3">
            {items}
          </div>
        </div>
      );
    }
    return (
      <div className="p-2">
      </div>
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
      .then((data) => {
        let itemName = this.props.item.name.toString();
        var sameNameItemsList = [];
        for (let corpusID in data) {
          let currentCorpus = data[corpusID];
          for (let itemID in currentCorpus) {
            let currentItem = currentCorpus[itemID];
            if (typeof(currentItem) === 'object') {
              currentItem.id = itemID;
              currentItem.corpus = corpusID;
              if (Array.isArray(currentItem.name)) {
                let currentItemName = currentItem.name.toString();
                if (currentItemName === itemName && currentItemName !== undefined && currentItem.id !== this.props.ID && currentItem.thumbnail !== undefined) {
                  sameNameItemsList.push(currentItem);
                }
              }
            }
          }
        }
        this.setState({sameNameItemsList});
      });

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

}

export default SameNameBlock;
