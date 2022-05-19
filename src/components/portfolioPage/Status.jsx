import React, { Component } from 'react';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';

class Status extends Component {
  render() {
    let clauses = this.props.query.getClauses();
    if (clauses.length === 0)
      return <Trans>Tous les items</Trans>;
    let status = [];
    clauses.forEach((clause, index) => {
      status.push('(');
      if (((clause.selection || []).length + (clause.exclusion || []).length) > 1) {
        status.push();
      }
      let topicsHTML = [
        ...clause.selection.map(id => ({excluded: false, id, topic: this._getCandidate(id)})),
        ...clause.exclusion.map(id => ({excluded: true, id, topic: this._getCandidate(id)}))]
        .sort(filter)
        .map(
          t => {
            let res = (t.topic === null) ? <Trans>Rubrique inconnue</Trans> : <Badge exclusion={t.excluded} id={t.id} name={t.topic.name} _changeItemState={this._changeItemState}/>;
            return res;
          }
        );
      status.push(topicsHTML.map((e, i) => i < topicsHTML.length - 1 ? [e, <Button clause={clause} _changeUnionState={this._changeUnionState}/>] : [e]).reduce((a, b) => a.concat(b))
      );
      status.push(')');

      if (clauses.length > 1 && index < (clauses.length - 1)) {
        status.push(<Button clause={this.props.query.getMainClause()} _changeUnionState={this._changeUnionState}/>);
      }
    });
    return status;
  }

  _getCandidate(id) {
    for (let v of this.props.candidates) {
      if (v[id]) {
        return v[id];
      }
    }
    return null;
  }

  _changeItemState = (criterion, toDelete) => {
    this.props.query.toggleCriterion(criterion, toDelete);
    this.props.history.push(this.props.query.toURI());
  };

  _changeUnionState = (clause) => {
    this.props.query.toggleOperator(clause);
    this.props.history.push(this.props.query.toURI());
  };
}

function filter(first, second) {
  if (first.topic === null && second.topic === null)
    return 0;

  if (first.topic === null && second.topic !== null)
    return 1;

  if (first.topic !== null && second.topic === null)
    return -1;

  return ((first.topic.name[0] > second.topic.name[0]) ? 1 : -1);
}

export default withRouter(Status);
