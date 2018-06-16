import React from 'react';
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
import Tree from 'react-ui-tree-porphyry';
import equal from 'deep-equal';
import Header from '../Header/Header.jsx';

import '../../styles/App.css';

const db = new Hypertopic(conf.services);

const _log = (x) => console.log(JSON.stringify(x, null, 2));
const _error = (x) => console.error(x.message);

function makeID() {
  var id = '';
  for (var i = 0; i < 6; i++) {
    id += Math.random().toString(15).substring(10);
  }
  id = id.slice(0, 32);
  return id;
}

class Outliner extends React.Component {

  constructor() {
    super();
    this.state = { stop: true, t_data: false, active: null };
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
  }

  render() {
    let status = this._getStatus();
    return (
      <div className="App container-fluid">
        <Header />
        <div className="Status row h5 text-center">{status}</div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4">
              <div className="Description">
                <h2 className="h4 font-weight-bold text-center">Point de vue</h2>
                <div className="p-3">
                  {this.state.title ? '' : this._getTitle()}
                  <div className="Outliner">
                   {this.state.t_data ? <Tree tree={this.state.t_data} renderNode={this.renderNode} onChange={this.handleChange} isNodeCollapsed={this.isNodeCollapsed} /> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="Return" onClick={this._returnHome}>
          🏠
        </button>
      </div>
    );
  }

  _returnHome() {
    window.location = '/';
  }

  _getTitle() {
    return (<form className="input-group" onSubmit={(e) => this._newVP(e)}>
      <input type="text" name="newTitle" className="form-control" placeholder="Nom du point de vue" />
      <div className="input-group-append">
        <button type="submit" className="btn add">+</button>
      </div>
    </form>);
  }

  _getStatus() {
    if (this.state.title !== undefined) {
      return "Modification du point de vue (Press CTRL to drag and drop)";
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

  componentDidMount() {
    this._fetchData();
    this._timer = setInterval(
      () => {
        if(this.state.fathers&&this.state.upper){
          if (this.state.fathers.upper !== this.state.upper) {
            this.setState({ upper: this.state.fathers.upper })
          }
        }
        db.get({ _id: this.props.match.params.id })
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

  onClickNode = node => {
    this.setState({
      active: node
    });
  };

  renderNode = (node, nodeIndex, removeNodeByID, addNode, forceChange) => {
    return (
      <div
        onClick={this.onClickNode.bind(null, node)}
        className="wrap">
        <span>
          {node.edit ? <input type='text' defaultValue={node.module} onKeyPress={(e) => { if (e.key === 'Enter') { let m = e.target.value; if (m === '') return null; else node.module = m; node.edit = false; this.setState({ update: true }); forceChange(); } }} /> : node.module}&nbsp;&nbsp;
         {nodeIndex !== 1 ? <button className="btn btn-sm" onMouseUp={() => { removeNodeByID(nodeIndex) }}>❌</button> : null}
          <button className="btn btn-sm" onMouseUp={() => { node.edit = true }}>✏️</button>
          <button className="btn btn-sm" onMouseUp={() => { let node = { id: makeID(), edit: true, module: '' }; addNode(nodeIndex, node) }}>➕</button>
        </span>
      </div>
    );
  };

  applyChange(tree) {
    let topics = {};
    let stack = [];
    stack.push([tree.children, false]);
    while (stack.length !== 0) {
      let nowNode = stack.pop();
      const lenNode = nowNode[0].length;
      let i = 0;
      for (i = 0; i < lenNode; i++) {
        if (!topics[nowNode[0][i].id]) {
          topics[nowNode[0][i].id] = { broader: nowNode[1] ? [nowNode[1]] : [], name: nowNode[0][i].module };
        }
        else {
          topics[nowNode[0][i].id].broader.push(nowNode[1]);
        }
        if (nowNode[0][i].children && nowNode[0][i].children.length !== 0) {
          stack.push([nowNode[0][i].children, nowNode[0][i].id]);
        }
      }
    }
    db.get({ _id: this.props.match.params.id })
      .then(data => {
        data.topics = topics;
        data.viewpoint_name = tree.module;
        return data;
      })
      .then(db.post);
  }

  handleChange = tree => {
    this.applyChange(tree);
  };

  _buildTree(data) {
    let treeData = { module: data.viewpoint_name, children: [] };
    const topics = data.topics;
    let _tData = treeData.children;
    let tFind = {};

    let i = {};
    let pi = 0;
    for (i in topics) {
      tFind[i] = pi;
      _tData.push({
        module: topics[i].name,
        id: i,
        children: []
      });
      ++pi;
    }
    let ndata = [];

    for (i in topics) {
      let topic = topics[i];
      const broader = topic.broader;
      let lb = broader.length;
      if (lb !== 0) {
        let j = 0;
        for (j = 0; j < lb; j++) {
          _tData[tFind[broader[j]]].children.push(_tData[tFind[i]]);
        }
      }
      else {
        ndata.push(_tData[tFind[i]]);
      }
    }

    treeData.children = ndata;
    this.setState({ t_data: treeData });
    console.log(treeData);
  }

  _fetchData() {
    var listFatherGroup = {};
    return db.get({ _id: this.props.match.params.id })
      .then(x => {
        this._buildTree(x);
        this.setState({ stop: true });
        this.setState({ topics: x.topics });
        this.setState({ title: x.viewpoint_name });
        return x.topics
      })
      .then(x => {
        let listFather = Object.keys(x).map(
          k => (k = x[k].broader.length < 1 ?
            { upper: [k] } :
            { [x[k].broader]: [k] })
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
        console.log(listFatherGroup);
        return listFatherGroup;
      })
      .then(x => this.setState({ fathers: x, stop: false }));
  }
}

export default Outliner;
