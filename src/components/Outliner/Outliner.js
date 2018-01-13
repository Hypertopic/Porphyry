import React from "react";
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
const db = new Hypertopic(conf.services);

var equal = require('deep-equal');

import '../../styles/App.css';

const _log = (x) => console.log(JSON.stringify(x, null, 2));
const _error = (x) => console.error(x.message);

function makeID() {
  var id = '';
  for (var i = 0; i<6;i++) {
    id += Math.random().toString(15).substring(10);
  }
  id = id.slice(0,32);
  return id;
}

class Outliner extends React.Component {

  constructor() {
    super();
    this.state = {stop : true, nextTitle : ''};
  }

  render() {
    var title = this._getTitle();
    return (
    <div>
      <div className='App'>
        <h1>{title} </h1>
        <div className='Status'>Modification du point de vue</div>
      </div>
      <div className="Outliner">
      <Tree data={this.state} childs={this.state.upper} father={[]} uri={this.props.match.params.id} stop={this.state.stop}/>
      </div>
    </div>
    );
  }

  _getTitle() {
    if (this.state.title !== undefined) {
      return this.state.title;
    } else {
      return (
        <div>
          <a className='add' onClick={(e) => this._newVP(this)}>+&nbsp;</a>
          <input type="text" value={this.state.nextTitle} onChange={this.addTitle.bind(this)} onKeyPress={this.handleKeyPress.bind(this)}/>
        </div>);
    }
  }

  _newVP() {
    db.post({_id:this.props.match.params.id, viewpoint_name: this.state.nextTitle, topics:{}})
      .then(_log)
      .then(this.setState({title : this.state.nextTitle}))
      .catch(_error);
  }

  handleKeyPress(event){
    if(event.key === 'Enter'){
      this._newVP(this);
    }
  }

  addTitle(event){
    this.setState({nextTitle : event.target.value})
  }

  componentDidMount() {
    this._fetchData();
    this._timer = setInterval(
      () => {
        if (this.state.fathers.upper !== this.state.upper) {
          this.setState({upper: this.state.fathers.upper})
        };
        db.get({_id: this.props.match.params.id})
          .then(x => {
            if (this.state.topics === undefined || !equal(x.topics, this.state.topics)) {
              this._fetchData()
            }
          });
      },
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _fetchData() {
    var listFatherGroup = {};
    return db.get({_id: this.props.match.params.id})
      .then(x => {
          this.setState({stop : true});
          this.setState({topics: x.topics});
          this.setState({title: x.viewpoint_name});
          return x.topics
      })
      .then(x => {
        let listFather = Object.keys(x).map(
          k => (k = x[k].broader.length < 1 ?
            {upper: [k]} :
            {[x[k].broader]: [k]})
        );
        listFather.forEach(
          e =>
          typeof listFatherGroup[Object.keys(e)] === "undefined" ?
          (listFatherGroup[Object.keys(e)] = Object.values(e)[0]) :
          (listFatherGroup[Object.keys(e)] = [
            ...listFatherGroup[Object.keys(e)],
            ...Object.values(e)[0]
          ])
        );
        return listFatherGroup;
      })
    .then(x => this.setState({fathers: x, stop : false}));
  }
}

class Tree extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        add: "",
        addSub: [""],
        childs: [],
        edit: false
      };
    }

    handleChange(type, index, event) {
      switch (type) {
        case 'edit':
          this.setState({edit : true});
          var childs = this.state.childs.slice();
          childs[index] = event.target.value;
          this.setState({childs : childs});
          break;
        case 'add':
          this.setState({add : event.target.value});
          break;
        case 'sub':
          var addSub = this.state.addSub.slice();
          addSub[index] = event.target.value;
          this.setState({addSub: addSub});
          break;
        default:
          console.log(type);
      }
    }

    handleKeyPress(type, index, event) {
      if(event.key === 'Enter'){
        switch (type) {
          case 'child':
            this._push(this.state.add,this.props.father);
            break;
          case 'sub':
            this._push(this.state.addSub[index],[this.props.childs[index]])
            break;
          case 'edit':
            this._editTopic(index);
            break;
          case 'first':
            this._push(this.state.add,[]);
            break;
          default:
            console.log(type);
        }
      }
    }

    _editTopic(index) {
      db.get({_id: this.props.uri})
        .then(data => {
          Object.assign(data.topics[this.props.childs[index]], {name: this.state.copy[index]});
          return data
        })
        .then(db.post)
        .catch(_error);
    }

    _deleteChild(index) {
      let listDelete = [];
      listDelete = this.collectChilds(this.props.childs[index],listDelete);
      this.deleteTop(listDelete);
      let childs = this.state.childs.slice(0,0);
      this.setState({childs : childs});
    }

    deleteTop(list){
      db.get({_id: this.props.uri})
        .then(data => {
          list.forEach(e =>
          delete data.topics[e]);
          return data
        })
        .then(db.post)
        .then(() => {
          let childs = this.state.childs.slice(0,0);
          this.setState({childs : childs})
        })
        .catch(_error);
      }

    collectChilds(e,list) {
      if (this.props.data.fathers[e] !== undefined) {
        this.props.data.fathers[e].map(c => {
          list = this.collectChilds(c,list);
        });
      }
      list.push(e);
      return list;
    }

    _push(name,broader) {
      var id = makeID();
      if (name !== ""){
        var newTopic = {name : name, broader : broader};
        db.get({_id: this.props.uri})
          .then(data => {
            Object.assign(data.topics, {[id] : newTopic});
            return data
          })
          .then(db.post)
          .then(() => this.setState({add : ''}))
          .catch(_error);
      }
    }

    display(idx) {
      if (!this.state.edit) {
        return this.state.childs[idx]
      } else {
        return this.state.copy[idx]
      }
    }

    render() {
      if (Array.isArray(this.props.childs) && !this.props.stop) {
        this.state.copy = this.state.childs.slice();
        this.state.childs = this.state.childs.slice(0,0);
        var childs = this.props.childs.map((e, idx) =>
          (typeof this.props.data.fathers[e] === "object") ?
          (this.state.childs.push(this.props.data.topics[e].name),
          <li key={e} className='outliner'>
            <a className='remove' onClick={(e) => this._deleteChild(idx)}>
              <img src='https://www.jobillico.com/images/ico-delete.png'/>&nbsp;
            </a>
            <a className='remove' onClick={(e) => this._editTopic(idx)}>
              <img src='https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/tlXhSXComXE.png'/>&nbsp;
            </a>
            <input type="text" value={this.display(idx)} onChange={this.handleChange.bind(this, 'edit', idx)} onKeyPress={this.handleKeyPress.bind(this, 'edit', idx)}/>
            <ul className='outliner'>
              {this._getChilds(e)}
            </ul>
          </li>)
          : (this.state.childs.push(this.props.data.topics[e].name),
          <li key={e} className='outliner'>
            <a className='remove' onClick={(e) => this._deleteChild(idx)}>
              <img src='https://www.jobillico.com/images/ico-delete.png'/>&nbsp;
            </a>
            <a className='remove' onClick={(e) => this._editTopic(idx)}>
              <img src='https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/tlXhSXComXE.png'/>&nbsp;
            </a>
            <input type="text" value={this.display(idx)} onChange={this.handleChange.bind(this, 'edit', idx)} onKeyPress={this.handleKeyPress.bind(this,'edit',idx)}/>
            <ul className='outliner'>
              <li key={idx} className='add'>
                <a className='add' onClick={(e) => this._push(this.state.addSub[idx],[this.props.childs[idx]])}>+&nbsp;</a>
                <input type="text" value={this.state.addSub[idx]} onChange={this.handleChange.bind(this, 'sub', idx)} onKeyPress={this.handleKeyPress.bind(this, 'sub',idx)}/>
              </li>
            </ul>
          </li>));
      return (
      <ul>
        <li className='add'>
          <a className='add' onClick={(e) => this._push(this.state.add,this.props.father)}>+&nbsp;</a>
          <input type="text" value={this.state.add} onChange={this.handleChange.bind(this, 'add', 0)} onKeyPress={this.handleKeyPress.bind(this,'child',0)}/>
        </li>
        {childs}
      </ul>);
    } else {
      return(
      <li className='add'>
        <a className='add' onClick={(e) => this._push(this.state.add,[])}>+&nbsp;</a>
        <input type="text" value={this.state.add} onChange={this.handleChange.bind(this, 'add', 0)} onKeyPress={this.handleKeyPress.bind(this,'first',0)}/>
      </li>);
    }
  }

  _getChilds(e) {
    return (<Tree childs={this.props.data.fathers[e]} father={[e]} data={this.props.data} uri={this.props.uri} stop={this.state.stop}/>);
  }

}

export default Outliner;
