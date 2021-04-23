import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import by from 'compare-func';

class Topic extends Component {
  constructor(props) {
    super();
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleClick = this.handleClick.bind(this);
    let hasSubtopics = (props.topics[props.id].narrower || []).length;
    this.state = {
      fold: hasSubtopics ? 'Closed' : ''
    };
  }

  render() {
    let subtopics = this._getSubtopics();
    let topicClasses = this.props.query.isSelectedOrExcluded(this.props.id);
    let topic = 'Topic ' + this.state.fold;
    let items = this.props.topicsItems.get(this.props.id);
    let count = (items) ? items.size : '';

    let bullet = getBullet(this.state.fold);
    return (
      <li className={topic}>
        <span className={bullet.className} title={bullet.title} aria-hidden="true" onClick={this.handleCollapse} />
        <button className={topicClasses + ' btn btn-link p-0 border-0 removeUnderlineOnFocus text-dark'} onClick={this.handleClick}>{this.props.name}</button>
        <span className="badge badge-pill badge-secondary ml-1">{count}</span>
        <ul>
          {subtopics}
        </ul>
      </li>
    );
  }

  _getSubtopics() {
    const topic = this.props.topics[this.props.id];
    return (topic.narrower || []).sort(by('name')).map(t =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.topics}
        query={this.props.query}
        topicsItems={this.props.topicsItems}
        history={this.props.history}
      />
    );
  }

  handleCollapse(e) {
    e.preventDefault();
    this.setState({fold: fold(this.state.fold)});
  }

  handleClick(e) {
    e.preventDefault();
    this.props.query.toggleTopic(this.props.id, this.props.topics);
	      this.props.history.push(this.props.query.toURI());
  }
}

function fold(x) {
  switch (x) {
    case 'Closed': return 'Opened';
    case 'Opened': return 'Closed';
    default: return '';
  }
}

function getBullet(x) {
  switch (x) {
    case 'Closed': return {className: 'oi oi-caret-right cursor-pointer', title: 'Déplier'};
    case 'Opened': return {className: 'oi oi-caret-bottom cursor-pointer', title: 'Replier'};
    default: return {className: 'oi leaf', title: ''};
  }
}
export default withRouter(Topic);
