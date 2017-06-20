import React, { Component } from 'react';
import by from 'sort-by';
import Hypertopic from 'hypertopic';
import conf from './config.json';
import Topic from './Topic';

class Viewpoint extends Component {
  constructor(props) {
    super();
    this.state = {
      name: props.name
    };
  }

  render() {
    let topics = this._getTopics();
    return (
      <div className="DescriptionModality">
        <h3>{this.state.name}</h3>
        <div className="Topics">
          <ul>
            {topics}
          </ul>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._fetchTopics();
  }

  _getTopics() {
    return (this.state.upper||[]).sort(by('name')).map((t) =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.state}/>
    );
  }

 _fetchTopics() {
    const hypertopic = new Hypertopic(conf.services);
    const id = this.props.id;
    hypertopic.getView(`/viewpoint/${id}`, (data) => {
      this.setState(data[id]);
    });
 }
}

export default Viewpoint;
