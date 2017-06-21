import React, { Component } from 'react';
import by from 'sort-by';

class Topic extends Component {
  render() {
    let subtopics = this._getSubtopics();
    let isSelected = this.props.selection.includes(this.props.id)? 'Selected' : '';
    let items = this.props.topicsItems.get(this.props.id);
    let count = (items)? `(${items.size})` : '';
    return (
      <li className="Topic">
        <div className={isSelected}>{this.props.name} <span>{count}</span></div>
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

export default Topic;
