import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import by from 'sort-by';
import queryString from 'query-string';

class Topic extends Component {
  constructor(props) {
    super();
    this.handleCollapse = this.handleCollapse.bind(this);
    let hasSubtopics =  (props.topics[props.id].narrower||[]).length;
    this.state = {
      fold: hasSubtopics? 'Closed' : ''
    };
  }

  render() {
    let subtopics = this._getSubtopics();
    let isSelected = this.props.selection.includes(this.props.id);
    let isExcluded = this.props.exclusion.includes(this.props.id);
    let topicClasses = (isSelected? 'Selected' : '') + " " + (isExcluded? 'Excluded' : '');
    let topic = 'Topic ' + this.state.fold;
    let items = this.props.topicsItems.get(this.props.id);
    let count = (items) ? items.size : '';
    let uri = '?';
    if(isSelected)
      uri += queryString.stringify({
          t: toggle(this.props.selection, this.props.id),
          e: toggle(this.props.exclusion, this.props.id)
      });
    else if (isExcluded)
        uri += queryString.stringify({
            t: this.props.selection,
            e: toggle(this.props.exclusion, this.props.id)
        });
    else
        uri += queryString.stringify({
            t: toggle(this.props.selection, this.props.id),
            e: this.props.exclusion
        });

    let bullet = getBullet(this.state.fold);
    return (
      <li className={topic}>
        <span className={bullet.className} title={bullet.title} aria-hidden="true" onClick={this.handleCollapse}></span>
        <Link to={uri} className={topicClasses}> {this.props.name} </Link>
        <span className="badge badge-pill badge-secondary ml-1">{count}</span>
        <ul>
        {subtopics}
        </ul>
      </li>
    );
  }

  _getSubtopics() {
    const topic = this.props.topics[this.props.id];
    return (topic.narrower||[]).sort(by('name')).map(t =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.topics}
        selection={this.props.selection} exclusion={this.props.exclusion} topicsItems={this.props.topicsItems} />
    );
  }

  handleCollapse(e) {
    e.preventDefault();
    this.setState({fold: fold(this.state.fold)});
  }
}

function toggle(array, item) {
  let s = new Set(array);
  if (!s.delete(item)) {
    s.add(item);
  }
  return [...s];
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
export default Topic;
