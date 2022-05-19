import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import by from 'compare-func';
import memoize from 'memoize-one';
import ItemCreator from './ItemCreator.jsx';
import GeographicMap from './GeographicMap.jsx';
import { Items } from '../../model.js';
import Selection from '../../Selection.js';

class Corpora extends Component {

  state = {
    criteria: 'name',
    listCorpus: [],
    firstReceive: false,
  };

  sort = memoize((items, criteria) => items.sort(by(`${criteria}.0`)));

  componentDidUpdate(prevProps) {
    if (this.props.ids.length !== prevProps.ids.length) {
      let listFormated = [...this.props.ids];
      listFormated = listFormated.map(corpus => {
        corpus = 'corpus : '.concat(corpus);
        return corpus;
      });
      this.setState({
        listCorpus: listFormated,
        firstReceive: true,
      });
    }
  }

  render() {
    let itemsData = this.sort(this.props.items, this.state.criteria);
    let items = itemsData.map(x =>
      <Item key={x.id} item={x} criteria={this.state.criteria} />
    );
    let attributes = new Items(this.props.items).getAttributeKeys().sort(by());
    let options = this._getOptions(attributes);
    let count = this.props.items.length;
    let total = this.props.from;
    let listIds = this.props.ids.map((corpus) =>{
      let corpusFormated = 'corpus : '.concat(corpus);
      return <div key={corpusFormated}> <input className="corpus_checkbox" type="checkbox" value={corpusFormated} onChange={this.handleChange} checked={this.isChecked(corpusFormated)}/> {corpus} <ItemCreator corpus={corpus} conf={this.props.conf} /></div>;
    }
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
            triés par&nbsp;
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

  handleChange = (e) => {
    let list = this.state.listCorpus;
    let index = list.indexOf(e.target.value);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(e.target.value);
    }
    this.setState({
      listCorpus: list
    });
    this.handleCorpusSelected(e.target.value);
  }

  isChecked(corpus) {
    const selection = Selection.fromURI();
    return selection.isSelectedOrExcluded(corpus) !== 'Excluded';
  }

  handleCorpusSelected(corpusId) {
    const selection = Selection.fromURI();
    selection.toggleCorpus(corpusId);
    this.props.history.push(selection.toURI());
  }
}

function Item(props) {
  let uri = `/item/${props.item.corpus}/${props.item.id}`;
  let name = [props.item.name].join(', '); //Name can be an array
  let thumbnail = props.item.thumbnail && <img src={props.item.thumbnail} alt={name} />;
  let criteria = (props.criteria !== 'name')
    && <div className="About"> {props.item[props.criteria]} </div>;
  return (
    <div className="Item">
      <Link to={uri}>
        {thumbnail}
        <div>{name}</div>
      </Link>
      {criteria}
    </div>
  );
}

export default Corpora;
