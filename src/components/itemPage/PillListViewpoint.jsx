import React from 'react';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import TopicPill from './TopicPill.jsx';

class TopicPillList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      topics: {},
    };
  }

  render() {
    const topics = this._getTopics();
    return (
      <div className="MobileViewpoint">
        <h3 className="h4">{this.state.name}</h3>
        {topics}
      </div>
    );
  }

  componentDidMount() {
    this._fetchViewpoint();
  }

  // This is the same as in src/components/itemPage/Viewpoint.jsx, fetching
  // the data higher in the component tree is possible but we needed to
  // implement this fast.
  async _fetchViewpoint() {
    let hypertopic = new Hypertopic((await conf).services);
    return hypertopic.getView(`/viewpoint/${this.props.id}`).then((data) => {
      let viewpoint = data[this.props.id];
      let name = viewpoint.name;
      let topics = viewpoint;
      delete topics.user;
      delete topics.name;
      delete topics.upper;
      this.setState({ name, topics });
    });
  }

  _getTopics() {
    const everyTopic = this.state.topics;
    return this.props.topics
      .filter(({ id }) => id in everyTopic)

      .map(({ id }) => {
        return (
          <div className="badge badge-pill badge-light" key={id}>
            <TopicPill id={id} name={everyTopic[id].name} />
          </div>
        );
      });
  }
}

export default TopicPillList;
