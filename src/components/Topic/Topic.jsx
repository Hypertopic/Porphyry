import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import by from 'sort-by';

class Topic extends Component {
  constructor(props) {
    super();
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleClick = this.handleClick.bind(this);
    let hasSubtopics = (props.topics[props.id].narrower || []).length;
    this.state = {
      fold: hasSubtopics ? 'Closed' : ''
    };
  }

  render() {
    let subtopics = this._getSubtopics();
    let isSelected = this.props.selection.includes(this.props.id);
    let isExcluded = this.props.exclusion.includes(this.props.id);
    let topicClasses = (isSelected ? 'Selected' : '') + " " + (isExcluded ? 'Excluded' : '');
    let topic = 'Topic ' + this.state.fold;
    let items = this.props.topicsItems.get(this.props.id);
    let count = (items) ? items.size : '';

    let bullet = getBullet(this.state.fold);
    return (
      <li className={topic}>
        <span className={bullet.className} title={bullet.title} aria-hidden="true" onClick={this.handleCollapse} />
        <button className={topicClasses + " btn btn-link p-0 border-0 removeUnderlineOnFocus text-dark"} onClick={this.handleClick}>{this.props.name}</button>
        <span className="badge badge-pill badge-secondary ml-1">{count}</span>
        <ul>
          {subtopics}
        </ul>
      </li>
    );
  }

  _getSubtopics() {
    const topic = this.props.topics[this.props.id];
    return (topic.narrower || []).sort(by('name')).map(t =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.topics}
        selection={this.props.selection} exclusion={this.props.exclusion}
        selectionJSON={this.props.selectionJSON}
        topicsItems={this.props.topicsItems}
        history={this.props.history}
      />
    );
  }

  handleCollapse(e) {
    e.preventDefault();
    this.setState({fold: fold(this.state.fold)});
  }

  handleClick(e) {
    e.preventDefault();
    updateSelectionJSON(this.props.topics, this.props.id, this.props.selectionJSON);
    this.props.history.push("/?t=" + JSON.stringify(this.props.selectionJSON));
  }
}

function updateSelectionJSON(array, item, selection) {
  if (selection === undefined)
    return;
  let found = selection.data.filter(s => {
    let allTopics = [...(s.selection || []), ...(s.exclusion || [])];
    if (allTopics.length === 0 || array[allTopics[0]] === undefined) {
      return false;
    }
    return (!array[allTopics[0]].hasOwnProperty('broader') && !array[item].hasOwnProperty('broader'))
      || (array[allTopics[0]].hasOwnProperty('broader') && array[allTopics[0]].broader[0].id) === (array[item].hasOwnProperty('broader') && array[item].broader[0].id);

  });

  if (found.length === 0) {
    selection.data.push({type: 'intersection', selection: [item], exclusion: []});
  } else {
    if(!found[0].hasOwnProperty('selection'))
      found[0].selection = [];
    if(!found[0].hasOwnProperty('exclusion'))
      found[0].exclusion = [];
    switchPlace(found[0], item);
    if((!Array.isArray(found[0].selection) || !found[0].selection.length) && (!Array.isArray(found[0].exclusion) || !found[0].exclusion.length))
      selection.data.splice(selection.data.indexOf(found[0]), 1);
  }
}

function switchPlace(object, item) {
  let index;
  if((index = object.selection.indexOf(item)) > -1) {
    object.selection.splice(index, 1);
    object.exclusion.push(item);
  } else if((index = object.exclusion.indexOf(item)) > -1) {
    object.exclusion.splice(index, 1);

  }
  else
    object.selection.push(item);
}

function fold(x) {
  switch (x) {
    case 'Closed': return 'Opened';
    case 'Opened': return 'Closed';
    default: return '';
  }
}

function getBullet(x) {
  switch (x) {
    case 'Closed': return {className: 'oi oi-caret-right cursor-pointer', title: 'Déplier'};
    case 'Opened': return {className: 'oi oi-caret-bottom cursor-pointer', title: 'Replier'};
    default: return {className: 'oi leaf', title: ''};
  }
}
export default withRouter(Topic);
