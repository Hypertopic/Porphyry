import React from 'react';
import TopicTree from '../../TopicTree.js';

class Node extends React.Component {

  constructor() {
    super();
    this.state = { edit: false, active: false, open: true };
  }

  render = () => {
    let change = this.props.change;
    let switchOpen = () => {
      this.setState({open: !this.state.open});
    };
    var isNew = this.props.me.new;
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
      let newName = e.target.value;
      change(this.props.id, {name: newName, new: false});
      isNew = false;
      switchEdit(e);
    };
    let handleInput = (e) => {
      switch (e.key) {
        case 'Enter':
          commitEdit(e);
          e.stopPropagation();
          break;
        case 'Escape':
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
    let thisNode = (this.state.edit)
      ? <input autoFocus type="text" className="editedNode"
        defaultValue={this.props.me.name}
        onKeyPress={handleInput} onKeyDown={handleInput} onBlur={commitEdit}
      />
      : <span className="node" onDoubleClick={switchEdit}>{this.props.me.name}</span>
    ;
    let children = [];
    if (this.props.topics) {
      for (var topID in this.props.topics) {
        let topic = this.props.topics[topID];
        if ((this.props.id && topic.broader.indexOf(this.props.id) !== -1)
          || (this.props.id === 'root' && topic.broader.length === 0)) {
          children.push(
            <Node key={topID} me={topic} id={topID} parent={this.props.id} topics={this.props.topics} activeNode={this.props.activeNode} draggedTopic={this.props.draggedTopic}
              activate={this.props.activate} change={this.props.change} delete={this.props.delete}/>
          );
        }
      }
    }
    var classes = ['outliner-node'];
    if (this.props.activeNode === this.props.id) {
      classes.push('active');
    }
    if (this.state.isDragged || this.state.isDraggedOver) {
      classes.push('dragged');
    }
    if (this.props.draggedTopic && this.state.isDraggedInto) {
      classes.push('dragged-into');
    }
    if (this.props.draggedTopic && this.state.isDraggedAfter) {
      classes.push('dragged-after');
    }
    if (this.props.id && children.length) {
      classes.push('has-children');
    }
    if (this.state.open) classes.push('open');
    else classes.push('closed');
    function setEdit(e) {
      if (!this.state.edit) switchEdit(e);
    }
    var draggable = this.props.id !== 'root';
    function onDragStart(e) {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('dragContent', this.props.id);
      activeMe(e);
      this.setState({isDragged: true});
      this.props.change(this.props.id, {startDrag: true});
    }
    function onDragStop(e) {
      e.stopPropagation();
      this.setState({isDragged: false});
      this.props.change(this.props.id, {startDrag: false});
    }

    let onDrag = (e) => {
      var draggedTopic = e.dataTransfer.getData('dragContent') || this.props.draggedTopic;
      if (!draggedTopic) {
        console.error('no dragged topic');
        return;
      }
      if (!this.props.topics[draggedTopic]) {
        console.error('unknown dragged topic ' + draggedTopic);
        return;
      }
      let topicTree = new TopicTree(this.props.topics);

      if (draggedTopic === this.props.id || topicTree.isAncestor(draggedTopic, this.props.id)) {
        //can't be dropped into itself or its descendant
        return;
      }
      let key = (e.currentTarget.className === 'wrap') ? 'isDraggedInto' : 'isDraggedAfter';
      this.setState({[key]: true});
      e.stopPropagation();
      e.preventDefault();
      return false;
    };
    let onDragLeave = (e) => {
      this.setState({isDraggedAfter: false, isDraggedInto: false});
      e.preventDefault();
      e.stopPropagation();
    };
    let onDrop = (e) => {
      this.setState({isDraggedAfter: false, isDraggedInto: false});
      let topicTree = new TopicTree(this.props.topics);
      var droppedTopic = e.dataTransfer.getData('dragContent');
      if (droppedTopic === this.props.id || topicTree.isAncestor(droppedTopic, this.props.id)) {
        //can't be dropped into itself or its descendant
        return;
      }
      let key = (e.currentTarget.className === 'wrap') ? 'parent' : 'moveAfter';
      this.props.change(droppedTopic, {[key]: this.props.id});
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <li className={classes.join(' ')}
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

export default Node;
