import React, { Component } from 'react';
import by from 'sort-by';

class Topic extends Component {
  render() {
    let subtopics = this._getSubtopics();
    return (
      <li className="Topic">{this.props.name}
        <ul>
        {subtopics}
        </ul>
      </li>
    );
  }

  _getSubtopics() {
    const topic = this.props.topics[this.props.id];
    return (topic.narrower||[]).sort(by('name')).map(t =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.topics} />
    );
  }
}

export default Topic;
