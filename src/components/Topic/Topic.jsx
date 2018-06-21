import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import by from 'sort-by';
import queryString from 'query-string';

class Topic extends Component {
  constructor(props) {
    super();
    this.handleCollapse = this.handleCollapse.bind(this);
    let hasSubtopics =  (props.topics[props.id].narrower||[]).length;
    this.state = {
      fold: hasSubtopics? 'Closed' : ''
    };
  }

  render() {
    let subtopics = this._getSubtopics();
    let isSelected = this.props.selection.includes(this.props.id)? 'Selected' : '';
    let topic = 'Topic ' + this.state.fold;
    let items = this.props.topicsItems.get(this.props.id);
    let count = (items) ? items.size : '';
    let uri = '?' + queryString.stringify({
      t: toggle(this.props.selection, this.props.id)
    });
    return (
      <li className={topic}>
        <a className="Bullet" onClick={this.handleCollapse} />
        <Link to={uri} className={isSelected}> {this.props.name} </Link>
        <span className="badge badge-pill badge-secondary">{count}</span>
        <ul>
        {subtopics}
        </ul>
      </li>
    );
  }

  _getSubtopics() {
    const topic = this.props.topics[this.props.id];
    return (topic.narrower||[]).sort(by('name')).map(t =>
      <Topic key={t.id} id={t.id} name={t.name} topics={this.props.topics}
        selection={this.props.selection} topicsItems={this.props.topicsItems} />
    );
  }

  handleCollapse(e) {
    e.preventDefault();
    this.setState({fold: fold(this.state.fold)});
  }
}

function toggle(array, item) {
  let s = new Set(array);
  if (!s.delete(item)) {
    s.add(item);
  }
  return [...s];
}

function fold(x) {
  switch (x) {
    case 'Closed': return 'Opened';
    case 'Opened': return 'Closed';
    default: return '';
  }
}

export default Topic;
