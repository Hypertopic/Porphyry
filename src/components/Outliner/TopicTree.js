class TopicTree {
  constructor(topics,rootName) {
    this.topics=topics;
    this.rootName=rootName;
  }

  makeID() {
    var id = '';
    for (var i = 0; i < 6; i++) {
      id += Math.random().toString(15).substring(10);
    }
    id = id.slice(0, 32);
    return id;
  }

  getTopic(id) {
    var topic=false;
    if (id!==false) {
      if (id) {
        topic=this.topics[id] || {
          id:id,
          broader:[]
        }
      } else {
        topic={name:this.rootName};
      }
    }
    return topic;
  }

  getParent(id) {
    let topic=this.getTopic(id);
    if (topic) {
      topic.broader=topic.broader || [];
      if (topic.broader.length) return topic.broader[0];
      else return "";
    }
    return false;
  }

  getChildren(id) {
    let children=[];
    for (var topID in this.topics) {
      let topic=this.topics[topID];
      if ((id && topic.broader.indexOf(id)!==-1)
        || (!id && topic.broader.length===0)) {
          children.push(topID);
      }
    }
    return children;
  }

  getSiblings(id) {
    return this.getChildren(this.getParent(id));
  }

  getPreviousSibling(id) {
    let siblings=this.getSiblings(id);
    let pos=siblings.indexOf(id);
    if (pos>0) {
      return siblings[pos-1];
    }
    return false;
  }

  getNextSibling(id) {
    let siblings=this.getSiblings(id);
    let pos=siblings.indexOf(id);
    if (pos<siblings.length-1) {
      return siblings[pos+1];
    }
    return false;
  }

  setParent(id,parent) {
    let topic=this.getTopic(id);
    if (topic && parent!==false) {
      console.log(`${parent} is new parent of ${id}`);
      if (!parent) {
        topic.broader=[]
      } else {
        topic.broader=[parent];
      }
    }
    return topic;
  }

  setOrder(children) {
    var changed=false;
    children.forEach(c => {
      let topic=this.topics[c];
      if (topic) {
        delete this.topics[c];
        this.topics[c]=topic;
        changed=true;
      }
    });
    return changed;
  }

  newChildren(parent) {
    let newId=this.makeID();
    let topic=this.getTopic(newId);
    this.topics[newId]=topic;
    let children=this.getChildren(parent);
    this.setParent(newId,parent);
    children.splice(0,0,newId);
    this.setOrder(children);
    return topic;
  }

  newSibling(sibling) {
    let parent=this.getParent(sibling);
    let siblings=this.getSiblings(sibling);
    let topic=this.newChildren(parent);
    let pos=siblings.indexOf(sibling);
    siblings.splice(pos+1,0,topic.id);
    this.setOrder(siblings);
    return topic;
  }

  deleteTopic(id) {
    if (!id || this.topics[id]) {
      let children=this.getChildren(id);
      let parent=this.getParent(id);
      children.forEach(id => {
        this.setParent(id,parent);
      });
      delete this.topics[id];
      return true;
    }
    return false;
  }

  promote(id) {
    //attach to parent's parent
    let parent=this.getParent(id);
    if (this.getTopic(parent)) {
      let newParent=this.getParent(parent);
      var newSiblings=this.getChildren(newParent);
      if (this.setParent(id,newParent)) {
        let pos=newSiblings.indexOf(parent);
        if (pos !== -1) {
          newSiblings.splice(pos+1,0,id);
          return this.setOrder(newSiblings);
        }
      }
    }
    return false;
  }

  demote(id) {
    //attach to previous sibling and set as last children
    let previousSibling=this.getPreviousSibling(id);
    if (previousSibling) {
      var newParent=previousSibling;
      var children=this.getChildren(newParent);
      if (this.setParent(id,newParent)) {
        children.push(id);
        return this.setOrder(children);
      }
    }
    return false;
  }
}

module.exports=TopicTree;
