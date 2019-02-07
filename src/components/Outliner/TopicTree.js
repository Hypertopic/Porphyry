function isInteger(int) {
  return int === parseInt(int, 10);
}

/*eslint no-extend-native: ["error", { "exceptions": ["Array"] }]*/
Array.prototype.move = function(from, to) {
  if (!isInteger(from) || !isInteger(to)) {
    console.error("bad parameters for Array.move");
    return;
  }
  if (from < to) to--;
  this.splice(to, 0, this.splice(from, 1)[0]);
};

class TopicTree {
  constructor(topics,rootName) {
    rootName=rootName||"anonymous-root";
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

  setRootName(rootName) {
    this.rootName=rootName;
  }

  getTopic(id) {
    var topic={id:"root",name:this.rootName};
    if (id && id!=="root") {
      topic=this.topics[id] || {
        id:id,
        broader:[]
      }
    }
    return topic;
  }

  isParent(id1,id2) {
    return this.getParent(id2)===id1;
  }

  isSibling(id1,id2) {
    return this.getSiblings(id1).indexOf(id2)!==-1;
  }

  isAncestor(id1,id2) {
    var parent=id2;
    while (parent!=="root") {
      if (parent===id1) return true;
      parent=this.getParent(parent);
    }
    return false;
  }

  getParent(id) {
    let topic=this.getTopic(id);
    if (topic) {
      topic.broader=topic.broader || [];
      if (topic.broader.length) return topic.broader[0];
      else return "root";
    }
    return false;
  }

  getChildren(id) {
    let children=[];
    for (var topID in this.topics) {
      let topic=this.topics[topID];
      if ( (id==="root" && topic.broader.length===0)
       || (id && topic.broader.indexOf(id)!==-1) ) {
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

  getLastChild(id) {
    let children=this.getChildren(id);
    if (children.length) {
      return this.getLastChild(children[children.length-1]);
    } else {
      return id;
    }
  }

  getPreviousTopic(id) {
    //find previous sibling last child, or parent
    let previousSibling=this.getPreviousSibling(id);
    if (previousSibling) {
      return this.getLastChild(previousSibling);
    } else {
      let parent=this.getParent(id);
      if (parent!==false && parent!==id) {
        return parent;
      } else {
        return id;
      }
    }
  }

  getNextTopic(id) {
    //find next children or sibling
    let children=this.getChildren(id);
    if (children.length) {
      return children[0];
    } else {
      var p=id,n;
      while (p && p!=="root" && !(n=this.getNextSibling(p))) {
        p=this.getParent(p);
      }
      if (n) return n;
      else return id;
    }
  }

  setParent(id,parent) {
    let topic=this.getTopic(id);
    if (topic && parent!==false) {
      console.log(`${parent} is new parent of ${id}`);
      if (parent==="root") {
        topic.broader=[]
      } else {
        topic.broader=[parent];
      }
    }
    return topic;
  }

  moveAfter(id,previousTopic) {
    if (!id) return;
    var siblings=this.getSiblings(id);
    let pos=siblings.indexOf(id);
    if (pos!==-1) {
      var newPos;
      if (!previousTopic) newPos=-1;
      else {
        newPos=siblings.indexOf(previousTopic);
        if (newPos===-1) return false;
      }
      siblings.move(pos,newPos+1);
      this.setOrder(siblings);
      return true;
    } else {
      //maybe accept to also change parent if
      // previousTopic is not a sibling?
    }
    return false;
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
    if (id && this.topics[id]) {
      let children=this.getChildren(id);
      let parent=this.getParent(id);
      let siblings=this.getSiblings(id);
      var pos=siblings.indexOf(id);
      children.forEach(children => {
        this.setParent(children,parent);
        siblings.splice(pos++,0,children);
      });
      delete this.topics[id];
      this.setOrder(siblings);
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
