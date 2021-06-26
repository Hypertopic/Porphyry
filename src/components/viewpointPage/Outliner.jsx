import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import Header from '../Header.jsx';
import TopicTree from '../../TopicTree.js';
import Node from './Node.jsx';
import { t, Trans } from '@lingui/macro';
import Contributors from './Contributors.jsx';

const _log = (x) => console.log(JSON.stringify(x, null, 2));
const _error = (x) => console.error(x.message);

class Outliner extends React.Component {

  constructor() {
    super();
    this.state = { };
    this.changing = false;
    this.topicTree = new TopicTree({});
  }

  render() {
    let status = this._getStatus();
    let topic = {name: this.state.title};
    let style = this.state.title ? 'col-md-8 p-4' : 'col-md-12 p-4';
    return (
      <div className="App container-fluid">
        <Header conf={conf} />
        <Helmet>
          <title>{this.state.title}</title>
        </Helmet>
        <div className="Status row h5">
          <Link to="/" className="badge badge-pill badge-light TopicTag">
            <span className="badge badge-pill badge-dark oi oi-chevron-left"> </span>
            <Trans>Retour à l'accueil</Trans>
          </Link>
        </div>
        <div className="container-fluid">
          <div className="App-content row">
            {this.state.title
              ? <Contributors viewpoint_id = {this.props.match.params.id} />
              : ''}
            <div className={style}>
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">{status}</h2>
                <div className="p-3">
                  {this.state.title
                    ? <ul className="Outliner">
                      <Node topics={this.state.topics} me={topic} activeNode={this.state.activeNode} draggedTopic={this.state.draggedTopic}
                        change={this.editTopic.bind(this)} activate={this.activeNode.bind(this)} id="root"/>
                    </ul>
                    : this._getTitle()
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  _getTitle() {
    return (<form className="input-group" onSubmit={(e) => this._newVP(e)}>
      <input type="text" name="newTitle" className="form-control" placeholder={t`Nom du point de vue`} />
      <div className="input-group-append">
        <button type="submit" id="addViewpoint" className="btn add btn-sm btn-light"><span className="oi oi-plus"> </span></button>
      </div>
    </form>);
  }

  _getStatus() {
    return (this.state.title !== undefined)
      ? <Trans>Modification du point de vue</Trans>
      : <Trans>Création du point de vue</Trans>;
  }

  async _newVP(e) {
    e.preventDefault();
    let title = e.target.newTitle.value;
    if (!title) return;
    let SETTINGS = await conf;
    let options = {};
    options.credentials = 'include';
    fetch(SETTINGS.services[0] + '/_session', options)
      .then(x => x.json())
      .then(x => {
        if (x.name || x.userCtx.name) {
          new Hypertopic(SETTINGS.services)
            .post({_id: this.props.match.params.id, viewpoint_name: title, topics: {}, users: [SETTINGS.user], contributors: [ x.name || x.userCtx.name]})
            .then(_log)
            .then(_ => this.setState({ title }))
            .then(_ => this._fetchData())
            .catch(_error);
        }
      }).catch(_error);
  }

  activeNode(activeNode) {
    this.setState({activeNode});
  }

  handleKeyAction(e) {
    var changed = false;
    var isNew = false;
    if (this.state.activeNode) {
      var topic = this.topicTree.getTopic(this.state.activeNode);
      isNew = topic.new || false;
    }
    switch (e.key) {
      case 'Enter':
        topic = this.topicTree.newSibling(this.state.activeNode);
        this.activeNode(topic.id);
        topic.new = true;
        e.preventDefault();
        this.setState(function(previousState) {
          // previousState.temptopics=previousState.temptopics || [];
          // previousState.temptopics.push(topic.id);
          previousState.topics = this.topicTree.topics;
          return previousState;
        });
        return;
      case 'Tab':
        if (!e.altKey && !e.ctrlKey) {
          if (e.shiftKey) {
            changed = this.topicTree.promote(this.state.activeNode);
          } else {
            changed = this.topicTree.demote(this.state.activeNode);
          }
        }
        break;
      case 'ArrowUp':
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
          this.activeNode(this.topicTree.getPreviousTopic(this.state.activeNode));
        }
        break;
      case 'ArrowDown':
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
          this.activeNode(this.topicTree.getNextTopic(this.state.activeNode));
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
          if (e.target.tagName === 'BODY' || e.target.value === '') {
            let previousTopic = this.topicTree.getPreviousTopic(this.state.activeNode);
            changed = this.topicTree.deleteTopic(this.state.activeNode);
            if (changed) this.activeNode(this.topicTree.getNextTopic(previousTopic));
          }
        }
        break;
      default:
    }
    if (changed) {
      e.preventDefault();
      this.setState({topics: this.topicTree.topics}, () => {
        if (!isNew) this.applyChange();
      });
    }
    return;
  };

  editTopic(id, change) {
    if (!this.setState) {
      return;
    }
    var toApply = false;
    return this.setState(previousState => {
      let topics = previousState.topics;
      if (topics) {
        let topic;
        if (id === 'root') {
          if (change.name && change.name !== previousState.title) {
            toApply = true;
            this.topicTree.setRootName(change.name);
            return {title: change.name};
          }
        } else if (topics[id]) {
          if (change.delete) {
            if (!topics[id].new) toApply = true;
            delete topics[id];
          } else {
            topic = topics[id];
          }
        }
        if (topic) {
          for (let key in change) {
            switch (key) {
              case 'parent':
                if (this.topicTree.getTopic(change.parent)) {
                  toApply = this.topicTree.setParent(id, change.parent)
                    && this.topicTree.moveAfter(id);
                }
                break;
              case 'moveAfter':
                if (this.topicTree.getTopic(change.moveAfter)) {
                  var newParent = this.topicTree.getParent(change.moveAfter);
                  if (newParent) {
                    toApply = this.topicTree.setParent(id, newParent);
                  }
                  toApply = toApply && this.topicTree.moveAfter(id, change.moveAfter);
                }
                break;
              case 'startDrag':
                if (change.startDrag === true) previousState.draggedTopic = id;
                else if (previousState.draggedTopic === id) {
                  delete previousState.draggedTopic;
                }
                break;
              default:
                if (topic[key] !== change[key]) {
                  topic[key] = change[key];
                  if (!topics[id].new) toApply = true;
                }
            }
          }
          if (!topics[id].new) delete topics[id].new;
        }
        return previousState;
      }
      return {};
    }, function() {
      if (toApply) this.applyChange();
    });
  }

  componentDidMount() {
    this._fetchData();
    document.addEventListener('keydown', this.handleKeyAction.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  async applyChange() {
    if (!this.changing) {
      let db = new Hypertopic((await conf).services);
      this.changing = db.get({ _id: this.props.match.params.id })
        .then(data => {
          data.topics = {};
          for (var id in this.state.topics) {
            if (!this.state.topics[id].new) {
              data.topics[id] = this.state.topics[id];
            }
          }
          data.viewpoint_name = this.state.title;
          return data;
        })
        .then(db.post)
        .then(() => {
          this.changing = false;
        })
        .catch(_ => {
          _error(_);
          this.changing = false;
          this._fetchData();
        });
    }
    return this.changing;
  }

  async _fetchData() {
    if (!this.changing) {
      new Hypertopic((await conf).services)
        .get({ _id: this.props.match.params.id })
        .then(x => {
          this.setState({ topics: x.topics, title: x.viewpoint_name });
          this.topicTree = new TopicTree(x.topics);
        });
    } else {
      return true;
    }
  }

}

export default Outliner;
