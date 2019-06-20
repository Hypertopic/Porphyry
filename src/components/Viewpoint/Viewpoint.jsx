import React, { Component } from 'react';
import by from 'sort-by';
import Topic from '../Topic/Topic.jsx';
import { Link } from 'react-router-dom';

class Viewpoint extends Component {
  render() {
    let topics = this._getTopics();
    let outliner = this._getOutliner();
    return (
      <div>
        <h3 className="h4">
          {this.props.viewpoint.name}
         <div className="outliner btn btn-sm btn-light float-right">
            <Link to={outliner}><span className="oi oi-pencil"> </span></Link>
          </div>
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
