import React from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import conf from '../../config/config.js';
import Header from '../Header/Header.jsx';
import Authenticated from '../Authenticated/Authenticated.jsx';
import TopicTree from './TopicTree.js';

import '../../styles/App.css';

const _log = (x) => console.log(JSON.stringify(x, null, 2));
const _error = (x) => console.error(x.message);

class Outliner extends React.Component {

  constructor() {
    super();
    this.state = { };
    this.changing=false;
    this.topicTree=new TopicTree({});
  }

  render() {
    let status = this._getStatus();
    let topic = {name: this.state.title};
    return (
      <div className="App container-fluid">
        <Header conf={conf} />
        <div className="Status row h5">
          <Authenticated conf={conf} />
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

  async _newVP(e) {
    e.preventDefault();
    let title = e.target.newTitle.value;
    if (!title) return;
    let SETTINGS = await conf;
    new Hypertopic(SETTINGS.services)
      .post({_id: this.props.match.params.id, viewpoint_name: title, topics: {}, users: [SETTINGS.user]})
      .then(_log)
      .then(_ => this.setState({ title }))
      .then(_ => this._fetchData())
      .catch(_error);
  }

  activeNode(activeNode) {
    this.setState({activeNode});
  }

  handleKeyAction(e) {
    var changed=false;
    var isNew=false;
    if (this.state.activeNode) {
      var topic=this.topicTree.getTopic(this.state.activeNode);
      isNew=topic.new || false;
    }
    switch (e.key) {
      case "Enter":
        topic=this.topicTree.newSibling(this.state.activeNode);
        this.activeNode(topic.id);
        topic.new=true;
        e.preventDefault();
        this.setState(function(previousState) {
          // previousState.temptopics=previousState.temptopics || [];
          // previousState.temptopics.push(topic.id);
          previousState.topics=this.topicTree.topics;
          return previousState;
        });
        return;
      case "Tab":
        if (!e.altKey && !e.ctrlKey) {
          if (e.shiftKey) {
            changed=this.topicTree.promote(this.state.activeNode);
          } else {
            changed=this.topicTree.demote(this.state.activeNode);
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
          if (e.target.tagName==="BODY" || e.target.value==='') {
            let previousTopic=this.topicTree.getPreviousTopic(this.state.activeNode);
            changed=this.topicTree.deleteTopic(this.state.activeNode);
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
    var toApply=false;
    return this.setState(previousState => {
      let topics=previousState.topics;
      if (topics) {
        let topic;
        if (id==="root") {
          if (change.name && change.name!==previousState.title) {
            toApply=true;
            this.topicTree.setRootName(change.name);
            return {title: change.name};
          }
        } else if (topics[id]) {
          if (change.delete) {
            if (!topics[id].new) toApply=true;
            delete topics[id];
          } else {
            topic=topics[id];
          }
        }
        if (topic) {
          for (let key in change) {
            switch(key) {
              case "parent":
                if (this.topicTree.getTopic(change.parent)) {
                  toApply = this.topicTree.setParent(id, change.parent)
                    && this.topicTree.moveAfter(id);
                }
                break;
              case "moveAfter":
                if (this.topicTree.getTopic(change.moveAfter)) {
                  var newParent=this.topicTree.getParent(change.moveAfter);
                  if (newParent) {
                    toApply = this.topicTree.setParent(id, newParent);
                  }
                  toApply = toApply && this.topicTree.moveAfter(id, change.moveAfter);
                }
                break;
              case "startDrag":
                if (change.startDrag===true) previousState.draggedTopic=id;
                else if (previousState.draggedTopic===id) {
                  delete previousState.draggedTopic;
                }
                break;
              default:
                if (topic[key]!==change[key]) {
                  topic[key]=change[key];
                  if (!topics[id].new) toApply=true;
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
    document.addEventListener("keydown", this.handleKeyAction.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  async applyChange() {
    if (!this.changing) {
      let db = new Hypertopic((await conf).services);
      this.changing=db.get({ _id: this.props.match.params.id })
        .then(data => {
          data.topics ={};
          for (var id in this.state.topics) {
            if (!this.state.topics[id].new) {
              data.topics[id]=this.state.topics[id];
            }
          }
          data.viewpoint_name = this.state.title;
          return data;
        })
        .then(db.post)
        .then(() => {
          this.changing=false;
        })
        .catch(_ => {
          _error(_);
          this.changing=false;
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

class Node extends React.Component {

  constructor() {
    super();
    this.state = { edit: false, active: false, open: true };
  }

  render = () => {
    let change=this.props.change;
    let switchOpen = () => {
      this.setState({open: !this.state.open});
    };
    var isNew=this.props.me.new;
    let switchEdit = (e) => {
      e.stopPropagation();
      this.setState((previousState) => {
        if (previousState.edit && isNew) {
          change(this.props.id, {delete: true});
        }
        return {edit: !previousState.edit};
      });
    };
    let commitEdit = (e) => {
      let newName=e.target.value;
      change(this.props.id, {name: newName, new: false});
      isNew=false;
      switchEdit(e);
    };
    let handleInput = (e) => {
      switch(e.key) {
        case "Enter":
          commitEdit(e);
          e.stopPropagation();
          break;
        case "Escape":
          switchEdit(e);
          e.stopPropagation();
          break;
        default:
      }
    };
    let activeMe = (e) => {
      e.stopPropagation();
      this.props.activate(this.props.id);
    };
    let thisNode;
    if (this.state.edit) {
      thisNode=<input autoFocus type='text' defaultValue={this.props.me.name} onKeyPress={handleInput} onKeyDown={handleInput} onBlur={commitEdit}/>;
    } else {
      thisNode=<span className="node" onDoubleClick={switchEdit}>{this.props.me.name}</span>;
    }
    let children=[];
    if (this.props.topics) {
      for (var topID in this.props.topics) {
        let topic=this.props.topics[topID];
        if ((this.props.id && topic.broader.indexOf(this.props.id)!==-1)
          || (this.props.id==="root" && topic.broader.length===0)) {
          children.push(
            <Node key={topID} me={topic} id={topID} parent={this.props.id} topics={this.props.topics} activeNode={this.props.activeNode} draggedTopic={this.props.draggedTopic}
              activate={this.props.activate} change={this.props.change} delete={this.props.delete}/>
          );
        }
      }
    }
    var classes=["outliner-node"];
    if (this.props.activeNode===this.props.id) {
      classes.push("active");
    }
    if (this.state.isDragged || this.state.isDraggedOver) {
      classes.push("dragged");
    }
    if (this.props.draggedTopic && this.state.isDraggedInto) {
      classes.push("dragged-into");
    }
    if (this.props.draggedTopic && this.state.isDraggedAfter) {
      classes.push("dragged-after");
    }
    if (this.props.id && children.length) {
      classes.push("has-children");
    }
    if (this.state.open) classes.push("open");
    else classes.push("closed");
    function setEdit(e) {
      if (!this.state.edit) switchEdit(e);
    }
    var draggable=this.props.id!=="root";
    function onDragStart(e) {
      e.stopPropagation();
      e.dataTransfer.effectAllowed="move";
      e.dataTransfer.setData("dragContent", this.props.id);
      activeMe(e);
      this.setState({isDragged: true});
      this.props.change(this.props.id, {startDrag: true});
    }
    function onDragStop(e) {
      e.stopPropagation();
      console.log("dragStop "+this.props.me.name);
      this.setState({isDragged: false});
      this.props.change(this.props.id, {startDrag: false});
    }

    let onDrag=(e) => {
      var draggedTopic=e.dataTransfer.getData("dragContent") || this.props.draggedTopic;
      if (!draggedTopic) {console.error("no dragged topic"); return}
      if (!this.props.topics[draggedTopic]) {console.error("unknown dragged topic "+draggedTopic); return}
      let topicTree=new TopicTree(this.props.topics);

      if (draggedTopic===this.props.id || topicTree.isAncestor(draggedTopic, this.props.id)) {
        //can't be dropped into itself or its descendant
        return;
      } else if (e.currentTarget.className==="wrap") { //child
        this.setState({isDraggedInto: true});
        e.stopPropagation();
        e.preventDefault();
        return false;
      } else if (e.currentTarget.className==="caret") {
        this.setState({isDraggedAfter: true});
        e.stopPropagation();
        e.preventDefault();
        return false;
      } else {

      }
    };
    let onDragLeave=(e) => {
      this.setState({isDraggedAfter: false, isDraggedInto: false});
      e.preventDefault();
      e.stopPropagation();
    };
    let onDrop=(e) => {
      this.setState({isDraggedAfter: false, isDraggedInto: false});
      let topicTree=new TopicTree(this.props.topics);
      var droppedTopic=e.dataTransfer.getData("dragContent");
      if (droppedTopic===this.props.id || topicTree.isAncestor(droppedTopic, this.props.id)) {
        //can't be dropped into itself or its descendant
        return;
      } else if (e.currentTarget.className==="wrap") { //child
        this.props.change(droppedTopic, {parent: this.props.id});
        e.stopPropagation();
        e.preventDefault();
      } else if (e.currentTarget.className==="caret") {
        this.props.change(droppedTopic, {moveAfter: this.props.id});
        e.stopPropagation();
        e.preventDefault();
      }
    };

    return (
      <li className={classes.join(" ")}
        draggable={draggable} onDragStart={onDragStart.bind(this)} onDragEnd={onDragStop.bind(this)}
      >
        <span className="caret" onClick={switchOpen} onDragOver={onDrag}
          onDragLeave={onDragLeave}
          onDrop={onDrop}> </span>
        <span className="wrap"
          onDragOver={onDrag} onDrop={onDrop}
          onDragLeave={onDragLeave}
          onClick={activeMe} onDoubleClick={setEdit.bind(this)}>
          {thisNode}
          <span className="id">{this.props.id}</span>
        </span>
        <ul>
          <li className="first-handle" />
          {children}
        </ul>
        <div className="after-handle"/>
      </li>
    );
  };

  componentDidMount() {
    if (!this.props.me.name || this.props.me.isNew) {
      this.setState({edit: true});
    }
  }

}

export default Outliner;
