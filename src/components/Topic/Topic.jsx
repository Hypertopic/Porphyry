import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import by from 'sort-by';
import queryString from 'query-string';

class Topic extends Component {
  render() {
    let subtopics = this._getSubtopics();
    let isSelected = this.props.selection.includes(this.props.id)? 'Selected' : '';
    let items = this.props.topicsItems.get(this.props.id);
    let count = (items)? `(${items.size})` : '';
    let uri = '?' + queryString.stringify({
      t: toggle(this.props.selection, this.props.id)
    });
    return (
      <li className="Topic">
        <div className={isSelected}>
          <Link to={uri}> {this.props.name} </Link>
          <span> {count}</span>
        </div>
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
        selection={this.props.selection} topicsItems={this.props.topicsItems} />
    );
  }
}

function toggle(array, item) {
  let s = new Set(array);
  if (!s.delete(item)) {
    s.add(item);
  }
  return [...s];
}

export default Topic;
