import React from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
import Header from '../Header/Header.jsx';
import Authenticated from '../Authenticated/Authenticated.jsx';
import TopicTree from './TopicTree.js';

import '../../styles/App.css';

const db = new Hypertopic(conf.services);

const _log = (x) => console.log(JSON.stringify(x, null, 2));
const _error = (x) => console.error(x.message);

class Outliner extends React.Component {

  constructor() {
    super();
    this.state = { };
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
  }

  render() {
    let status = this._getStatus();
    return (
      <div className="App container-fluid">
        <Header />
        <div className="Status row h5">
          <Authenticated/>
          <Link to="/" className="badge badge-pill badge-light TopicTag">
            <span className="badge badge-pill badge-dark oi oi-chevron-left"> </span> Retour à l'accueil
          </Link>
        </div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-12 p-4">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">{status}</h2>
                <div className="p-3">
                  {this.state.title ? '' : this._getTitle()}
                  <ul className="Outliner">
                    <Node topics={this.state.topics} name={this.state.title} activeNode={this.state.activeNode}
                      change={this.editTopic.bind(this)} activate={this.activeNode.bind(this)}/>
                  </ul>
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
      <input type="text" name="newTitle" className="form-control" placeholder="Nom du point de vue" />
      <div className="input-group-append">
        <button type="submit" className="btn add btn-sm btn-light"><span className="oi oi-plus"> </span></button>
      </div>
    </form>);
  }

  _getStatus() {
    if (this.state.title !== undefined) {
      return "Modification du point de vue";
    } else {
      return "Création du point de vue";
    }
  }

  _newVP(e) {
    e.preventDefault();
    let title = e.target.newTitle.value;
    if (!title) {
      return;
    }
    db.post({ _id: this.props.match.params.id, viewpoint_name: title, topics: {}, users: [this.user] })
      .then(_log)
      .then(_ => this.setState({ title }))
      .then(_ => this._fetchData())
      .catch(_error);
  }

  activeNode(id) {
    this.setState({activeNode:id});
  }

  handleKeyAction(e) {
    var changed=false;
    if (!this.state.activeNode || !this.state.topics[this.state.activeNode]) {
      //nothing to work on
      return;
    }
    if (e.cancelBubble) return;
    switch (e.key) {
      case "Enter":
        this.topicTree.newSibling(this.state.activeNode);
        changed=true;
        break;
      case "Tab":
        if (!e.altKey && !e.ctrlKey) {
          if (e.shiftKey) {
            changed=this.topicTree.promote(this.state.activeNode);
          } else {
            changed=this.topicTree.demote(this.state.activeNode);
          }
        }
        break;
      case 'Delete':
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
          changed=this.topicTree.deleteTopic(this.state.activeNode);
        }
        break;
      default:
        changed=false;
    }
    if (changed) {
      this.setState({topics:this.topicTree.topics},this.applyChange.bind(this));
    }
    return;
  };

  editTopic(id,change) {
    if (!this.setState) {
      console.log("no setState ?");
      return;
    }
    return this.setState(previousState => {
      let topics=previousState.topics;
      let topic;
      if (id && topics[id]) {
        if (change.delete) {
          delete topics[id];
        } else {
          topic=topics[id];
        }
      }
      if (topic) {
        for (let key in change) {
          topic[key]=change[key];
        }
      }
      return {topics};
    },this.applyChange.bind(this));
  }

  componentDidMount() {
    this._fetchData();
    this._timer = setInterval(this._fetchData.bind(this),1000);
    document.addEventListener("keypress", this.handleKeyAction.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  applyChange() {
    return db.get({ _id: this.props.match.params.id })
      .then(data => {
        data.topics = this.state.topics;
        data.viewpoint_name = this.state.title;
        return data;
      })
      .then(db.post)
      .catch(_ => {
        _error(_);
        this._fetchData()
      });
  }

  _fetchData() {
    return db.get({ _id: this.props.match.params.id })
      .then(x => {
        this.setState({ topics: x.topics, title: x.viewpoint_name });
        this.topicTree=new TopicTree(x.topics);
      });
  }

}

class Node extends React.Component {

  constructor() {
    super();
    this.state = { edit: false, active: false, open: false };
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
  }

  render = () => {
    let switchOpen = () => {
      this.setState({open:!this.state.open});
    }
    let switchEdit = (e) => {
      e.stopPropagation();
      this.setState({edit:!this.state.edit});
    }
    let change=this.props.change;
    let commitEdit = (e) => {
      let newName=e.target.value;
      change(this.props.id,{name:newName});
      switchEdit(e);
    }
    let handleInput = (e) => {
      if (e.key==="Enter") {
        e.cancelBubble=true;
        commitEdit(e);
      }
    };
    let activeMe = (e) => {
      e.stopPropagation();
      this.props.activate(this.props.id);
    }
    let thisNode;
    if (this.state.edit || !this.props.name) {
      thisNode=<input autoFocus type='text' defaultValue={this.props.name} onKeyPress={handleInput} onBlur={commitEdit}/>;
    } else {
      thisNode=<span className="node" onDoubleClick={switchEdit}>{this.props.name}</span>;
    }
    let children=[];
    if (this.props.topics) {
      for (var topID in this.props.topics) {
        let topic=this.props.topics[topID];
        if ((this.props.id && topic.broader.indexOf(this.props.id)!==-1)
          || (!this.props.id && topic.broader.length===0)) {
            children.push(
              <Node key={topID} id={topID} name={topic.name} topics={this.props.topics} activeNode={this.props.activeNode} parent={this.props.id}
                activate={this.props.activate} change={this.props.change}/>
            );
        }
      }
    }
    var classes=["outliner-node"];
    if (this.props.activeNode===this.props.id) {
      classes.push("active");
    }
    let caret;
    if (this.props.id && children.length) {
      caret=<span className="caret" onClick={switchOpen}> </span>;
      if (this.state.open) classes.push("open");
      else classes.push("closed");
    } else {
      caret=null;
    }
    return (
      <li className={classes.join(" ")}>
        {caret}<span className="wrap" onClick={activeMe}>{thisNode}</span>
        <ul>{children}</ul>
      </li>);
  };

}

export default Outliner;
