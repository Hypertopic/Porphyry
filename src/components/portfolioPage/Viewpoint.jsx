import React, { Component } from 'react';
import by from 'compare-func';
import Topic from './Topic.jsx';

class Viewpoint extends Component {
  render() {
    let topics = this._getTopics();
    let outliner = this._getOutliner();
    return (
      <div>
        <h3 className="h4">
          {this.props.viewpoint.name}
          <a className="outliner btn btn-sm btn-light float-right" href={outliner}>
            <span className="oi oi-pencil"> </span>
          </a>
        </h3>
        <hr/>
        <div className="Topics">
          <ul>
            {topics}
          </ul>
        </div>
      </div>
    );
  }

  _getTopics() {
    return (this.props.viewpoint.upper || []).sort(by('name')).map((t) =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.viewpoint}
        topicsItems={this.props.topicsItems}
        query={this.props.query}
      />
    );
  }

  _getOutliner() {
    let uri = '/viewpoint/' + this.props.viewpoint.id;
    return uri;
  }
}

export default Viewpoint;
