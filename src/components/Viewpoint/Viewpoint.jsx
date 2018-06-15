import React, { Component } from 'react';
import by from 'sort-by';
import Topic from '../Topic/Topic.jsx';

class Viewpoint extends Component {
  render() {
    let topics = this._getTopics();
    let outliner = this._getOutliner();
    return (
      <div className="DescriptionModality">
        <h3>
          {this.props.viewpoint.name}
          <a className='outliner' href={outliner}>
            ✏️
          </a>
        </h3>
        <div className="Topics">
          <ul>
            {topics}
          </ul>
        </div>
      </div>
    );
  }

  _getTopics() {
    return (this.props.viewpoint.upper||[]).sort(by('name')).map((t) =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.viewpoint}
        selection={this.props.selection} topicsItems={this.props.topicsItems} />
    );
  }

  _getOutliner() {
    let uri = '/viewpoint/' + this.props.viewpoint.id;
    return uri;
  }
}

export default Viewpoint;
