import React, { Component } from 'react';
import by from 'sort-by';
import Hypertopic from 'hypertopic';
import conf from './config.json';
import Topic from './Topic';

class Viewpoint extends Component {
  constructor(props) {
    super();
    this.state = {
      name: props.name,
      upper: [],
      topics: []
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
    return this.state.upper.map((t) =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.state.topics}/>
    );
  }

 _fetchTopics() {
    const hypertopic = new Hypertopic(conf.services);
    const id = this.props.id;
    hypertopic.getView(`/viewpoint/${id}`, (data) => {
      let topics = data[id];
      let upper = topics.upper;
      delete topics.upper;
      upper.sort(by('name'));
      this.setState({topics, upper});
    });
 }
}

export default Viewpoint;
