import React from 'react';
import { Link } from 'react-router-dom';

class TopicPath extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      path: []
    };
  }

  render() {
    let topics = this._getTopics();
    for (let i = 1; i < topics.length; ++i) {
      let key="separator-"+i;
      topics.splice(i, 0, <span key={key} className="TopicSeparator">&gt;</span>);
      ++i;
    }
    const topicId = this.state.path[this.state.path.length - 1]
      ? `${this.state.path[this.state.path.length - 1].id}`
      : '';
    return (
      <div className="TopicPath">
        {topics}
        <button type="button" className="btn btn-xs ml-3 float-right DeleteButton d-none d-sm-block"
          onClick={this.props.removeTopic} id={`deleteButton-${topicId}`}>
          <span className="oi oi-x"> </span>
        </button>
      </div>
    );
  }

  _updatePath() {
    let topic = this._getTopic(this.props.id);
    let path = [topic];
    while (topic.broader && topic.broader.length) {
      topic = this._getTopic(topic.broader[0].id);
      path.unshift(topic);
    }
    this.setState({path});
  }

  componentDidMount() {
    this._updatePath();
  }

  componentDidUpdate(prevProps) {
    if (this.props.topics !== prevProps.topics) {
      this._updatePath();
    }
  }

  _getTopic(id) {
    let topic = this.props.topics[id] || {};
    topic.id = id;
    return topic;
  }

  _getTopics() {
    return this.state.path.map( t => {
      let name = t.name || '';
      let uri = `../../?t={"type":"intersection","data":[{"type":"intersection","selection":["${t.id}"],"exclusion":[]}]}`;
      return (
        <Link title={t.id} key={t.id} className="Topic" to={uri}>{name}</Link>
      );
    });
  }

}

export default TopicPath;
