import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { TagCloud } from 'react-tagcloud';

class Cloud extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.selection.length !== nextProps.selection.length) return true;
    if (
      Object.keys(this.props.viewpoint).length !==
      Object.keys(nextProps.viewpoint).length
    )
      return true;
    return false;
  }

  render() {
    const { selection, viewpoint, topicsItems } = this.props;
    let alltopics = [];
    this.pushChildInTab(viewpoint.upper || [], alltopics);
    alltopics = alltopics
      .filter(topic => topic.name)
      .map(topic => {
        let items = topicsItems.get(topic.id);
        let found = selection.find(s => s === topic.id);

        let uri =
          '?' +
          queryString.stringify({
            t: this.toggle(selection, topic.id)
          });
        return {
          value: topic.name[0],
          count: items ? items.size : 0,
          color: found ? 'selected' : '',
          uri
        };
      })
      .sort((a, b) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      });
    return (
      <TagCloud
        minSize={10}
        maxSize={25}
        shuffle={false}
        tags={alltopics}
        disableRandomColor
        renderer={(tag, size, color) => {
          return (
            <Link key={tag.value} to={tag.uri}>
              <span
                style={{
                  fontSize: `${size}px`,
                  margin: '3px',
                  padding: '3px',
                  display: 'inline-block',
                  color: 'black'
                }}
                className={color === 'selected' ? 'Cloud-Selected' : ''}
              >
                {tag.value}
              </span>
            </Link>
          );
        }}
      />
    );
  }

  pushChildInTab = (topics, tab) => {
    topics.forEach(t => {
      let topic = this.props.viewpoint[t.id];
      if (topic.narrower) {
        this.pushChildInTab(topic.narrower, tab);
      }
      topic.id = t.id;
      tab.push(topic);
    });
  };
  toggle = (array, item) => {
    let s = new Set(array);
    if (!s.delete(item)) {
      s.add(item);
    }
    return [...s];
  };
}

export default Cloud;
