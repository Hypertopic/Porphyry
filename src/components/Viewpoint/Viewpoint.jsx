import React, { Component } from 'react';
import by from 'sort-by';
import Topic from '../Topic/Topic.jsx';

class Viewpoint extends Component {
  render() {
    let topics = this._getTopics();
    return (
      <div>
        <h3 className="h4">{this.props.viewpoint.name}</h3>
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
    return (this.props.viewpoint.upper||[]).sort(by('name')).map((t) =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.viewpoint}
        selection={this.props.selection} topicsItems={this.props.topicsItems} />
    );
  }
}

export default Viewpoint;
