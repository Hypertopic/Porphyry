import React, { Component } from 'react';
import by from 'sort-by';

class Topic extends Component {
  render() {
    let subtopics = this._getSubtopics();
    let isSelected = this.props.selection.includes(this.props.id)? 'Selected' : '';
    return (
      <li className="Topic"><div className={isSelected}>{this.props.name}</div>
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
        selection={this.props.selection} />
    );
  }
}

export default Topic;
