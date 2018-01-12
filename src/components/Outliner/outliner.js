import React from "react";
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';
const db = new Hypertopic(conf.services);

//modifier feuille de style

class Outliner extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>
          {this.state.title}
        </h1>
        <Tree data={this.state} father={this.state.upper} id={this.props.match.params.id}/>
      </div>
    );
  }

  componentDidMount() {
    this._fetchData();
    this._timer = setInterval(
      () => {
        if (this.state.fathers.upper !== this.state.upper){
          this.setState({
            upper: this.state.fathers.upper
          })
        }
      },
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _fetchData() {

    var listFatherGroup = {};

    db.get({ _id: this.props.match.params.id })
    .then(x => {this.setState({topics : x.topics});
    this.setState({title : x.viewpoint_name});
    return x.topics})
    .then(x => {
      let listFather = Object.keys(x).map(
        k =>
        (k = x[k].broader.length < 1 ? { upper: [k] } : { [x[k].broader]: [k] })
      );
      listFather.forEach(
        e =>
        typeof listFatherGroup[Object.keys(e)] === "undefined"
        ? (listFatherGroup[Object.keys(e)] = Object.values(e)[0])
        : (listFatherGroup[Object.keys(e)] = [
          ...listFatherGroup[Object.keys(e)],
          ...Object.values(e)[0]
        ])
      );
      console.log(listFatherGroup);
      return listFatherGroup;
    });
    this.setState({fathers : listFatherGroup});
  }

}

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {childs : []};
  }

  handleChange(index,event) {
    const _log = (x) => console.log(JSON.stringify(x, null, 2));
    var childs = this.state.childs.slice();
    childs[index] = event.target.value;
    this.setState({childs: childs});
    db.get({_id:this.props.id})
    .then(x => Object.assign(x.topics[this.props.father[index]], {name:childs[index]}))
    .then(db.post);

    db.get({_id:this.props.id})
    .then(x => x = x.topics[this.props.father[index]])
    .then(_log);

    console.log(db.post);
  }

  render() {
    if (Array.isArray(this.props.father)) {
      const childs = this.props.father.map((e,idx) =>
      (typeof this.props.data.fathers[e] === "object") ?
      (this.state.childs.push(this.props.data.topics[e].name),
      //<form onSubmit={this.handleSubmit}>
        <li key={e}>
          <input type="text" value={this.state.childs[idx]}  onChange={this.handleChange.bind(this,idx)} />
          <ul> {this._getChilds(e)} </ul>
        </li>
      //</form>
    )
      :
      (this.state.childs.push(this.props.data.topics[e].name),
      <li key={e}>
        <input type="text" value={this.state.childs[idx]}  onChange={this.handleChange.bind(this,idx)} />
      </li>));
      return (<ul> {childs} </ul>);
    } else {
      return <li> NOTHING </li>
    }
  }

  _getChilds(e) {
    return (
      <Tree father={this.props.data.fathers[e]} data={this.props.data} id={this.props.id}/>
    );
  }
}

export default Outliner;
