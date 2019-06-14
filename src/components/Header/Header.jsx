import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import conf from '../../config/config.json';

class Header extends Component {
  constructor() {
    super();
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
    this.state = {
      searchWord:''
    };
  }

  render() {
    const searchDropDown = this.searchOption();
    return (
      <header className="row align-items-center">
        <div className="col-lg-2 col-md-3 d-none d-md-block logo"></div>
        <div className="col-lg-2 col-md-3 col-sm-4">
          <input className="form-control" type="text" placeholder="Rechercher..."
            value={this.state.searchWord}
            onChange={e => {
              this.setState({ searchWord: e.target.value })
            }}
            onKeyPress={ e => {
              if (e.key === 'Enter') {
                console.log('send searchWord:'+this.state.searchWord);
                // this.props.update(this.state.searchWord);
                e.target.blur()
              }
            }}
          />
          <ul>{searchDropDown}</ul>
        </div>
        <h1 className="text-center col-lg-8 col-md-6 col-sm-8"><Link to="/">{this.user}</Link></h1>
      </header>
    );
  }

  searchOption() {
    var res = [];
    for (const key in this.props.selectedItems) {
      if (this.props.selectedItems.hasOwnProperty(key) && this.state.searchWord.length>0) {
        const element = this.props.selectedItems[key];
        const uri = `/item/${element.corpus}/${element.id}`;
        if (element.name[0].includes(this.state.searchWord)) {
          res.push(<li className="form-control" key={key}><Link to={uri}>{element.name}</Link></li>)
        }
      }
    }
    return res
  }

  _getSearchWord = () => {
    return this.state.searchWord;
  }
}

export default Header;

