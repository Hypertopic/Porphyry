import React from 'react';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import {Trans} from '@lingui/macro';

const _error = (x) => console.error(x.message);

class Contributors extends React.Component {

  constructor() {
    super();
    this.state = { };
  }

  render() {
    let contributors = this.state.contributors;
    return (
      <div className="Description">
        <h2 className="h4 font-weight-bold text-center"><Trans>Contributeurs</Trans></h2>
        <div className="p-3">
          <form className="" onSubmit={(e) => this._getContributor(e)}>
            <div className="row">
              <div className="col-xs-8 mx-2 mt-1">
                <input className="form-control" type="text" name="contributorToAdd" id="contributorToAdd"/>
              </div>
              <div className="col-xs-3 mt-1">
                <button type="submit" className="btn btn-light ml-2"><Trans>Ajouter</Trans></button>
              </div>
            </div>
          </form>
          <ul className="list-group mt-4">
            {contributors ? contributors.map(item => <li className="list-group-item" key={item}>{item}</li>) : <Trans>Pas de contributeurs</Trans>}
          </ul>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._fetchData();
  }

  _getContributor(event) {
    event.preventDefault();
    let contributor = event.target.contributorToAdd.value;
    if (!contributor) return;
    this.addContributors(contributor);
  }
  async addContributors(contributor) {
    const db = new Hypertopic((await conf).services);
    db.get({ _id: this.props.viewpoint_id })
      .then(x => {
        x.contributors = [...new Set(x.contributors).add(contributor)];
        return x;
      })
      .then(db.post)
      .then(x => this.setState({contributors: x.contributors}))
      .catch(_error);
  }

  async _fetchData() {
    new Hypertopic((await conf).services)
      .get({ _id: this.props.viewpoint_id })
      .then(x => {
        this.setState({contributors: x.contributors });
      });
  }

}
export default Contributors;