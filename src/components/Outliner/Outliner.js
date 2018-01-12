import React from "react";
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
const db = new Hypertopic(conf.services);

var equal = require('deep-equal');

import '../../styles/App.css';

const _log = (x) => console.log(JSON.stringify(x, null, 2));
const _error = (x) => console.error(x.message);

class Outliner extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="Outliner" >
      <h1> {this.state.title} </h1>
      <Tree data={this.state} childs={this.state.upper} father={[]} uri={this.props.match.params.id} fetch={this._fetchData}/>
      </div>
    );
  }

  componentDidMount() {
    this._fetchData();
    this._timer = setInterval(
      () => {
        if (this.state.fathers.upper !== this.state.upper) {
          console.log('DEQFNZOGFNZOGN');
          this.setState({upper: this.state.fathers.upper})
        };
        db.get({_id: this.props.match.params.id})
          .then(x => {
            if (this.state.topics === undefined || !equal(x.topics, this.state.topics)) {
              console.log('ON UPDATE');
              this._fetchData()
            }
          });
      },
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _fetchData() {

    var listFatherGroup = {};
    return db.get({_id: this.props.match.params.id})
      .then(x => {
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
    .then(x => this.setState({
      fathers: x
    }));
  }

}

class Tree extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        add: "",
        childs: []
      };
    }

    handleChange(index, event) {
      var childs = this.state.childs.slice();
      childs[index] = event.target.value;
      this.setState({childs: childs});
      db.get({_id: this.props.uri})
        .then(data => {
          Object.assign(data.topics[this.props.childs[index]], {name: childs[index]});
          return data
        })
        .then(db.post)
        .catch(_error);
    }

    addTopic(event) {
      this.setState({add : event.target.value});
    }

    _deleteChild(index) {
      if (this.props.data.fathers[this.props.childs[index]] != undefined) {
        console.log('PAS VIDE');
        this.props.data.fathers[this.props.childs[index]].map(e =>
          console.log(this.props.data.topics[e])
        )
      }
      db.get({_id: this.props.uri})
        .then(data => {
          delete data.topics[this.props.childs[index]];
          return data
        })
        .then(db.post)
        .catch(_error);
    }

    _addChild() {

        if (this.state.add != "") {
        function makeID() {
          var id = '';
          for (var i = 0; i<5;i++) {
            id += Math.random().toString(15).substring(10);
          }
          return id;
        }
        var id = makeID()
        var newTopic = {
          name : this.state.add,
          broader : this.props.father
        };
        console.log(id : newTopic);
        db.get({_id: this.props.uri})
          .then(data => {
            Object.assign(data.topics, {[id] : newTopic});
            return data
          })
          .then(db.post)
          .catch(_error);
        this.updateOutliner();
        }
    }

    updateOutliner() {
      console.log('on clear');
      this.setState({add : ''});
    }

    render() {
        if (Array.isArray(this.props.childs)) {
          const childs = this.props.childs.map((e, idx) =>
            (typeof this.props.data.fathers[e] === "object") ?
            (this.state.childs.push(this.props.data.topics[e].name),
            <li key={e} className = 'outliner'>
              <a className='remove' onClick={(e) => this._deleteChild(idx)}>x   </a>
              <input type="text" value={this.state.childs[idx]} onChange={this.handleChange.bind(this, idx)}/>
              <ul className='outliner'>
                {this._getChilds(e)}
              </ul>
            </li>)
            : (this.state.childs.push(this.props.data.topics[e].name),
            <li key={e} className = 'outliner'>
              <a className='remove' onClick={(e) => this._deleteChild(idx)}>x   </a>
              <input type="text" value={this.state.childs[idx]} onChange={this.handleChange.bind(this, idx)}/>
            </li>));
              return (
              <ul>
                <li className='add'>
                  <a className='add' onClick={(e) => this._addChild(this)}>+   </a>
                  <input type="text" value={this.state.add} onChange={this.addTopic.bind(this)}/>
                </li>
                {childs}
              </ul>);
              } else {
                return <li> NOTHING </li>
              }
            }

            _getChilds(e) {
              return (<Tree childs={this.props.data.fathers[e]} father={[e]} data={this.props.data} uri={this.props.uri}/>);
            }
          }

          export default Outliner;
