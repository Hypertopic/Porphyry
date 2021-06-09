import parse from 'voll';

let switchPlace = (clause, criterion, toDelete, threeState) => {
  let index;
  if ((index = clause.selection.indexOf(criterion)) > -1) {
    clause.selection.splice(index, 1);
    if (!toDelete)
      clause.exclusion.push(criterion);
  } else if ((index = clause.exclusion.indexOf(criterion)) > -1) {
    clause.exclusion.splice(index, 1);
    if (!toDelete && !threeState)
      clause.selection.push(criterion);
  } else {
    clause.selection.push(criterion);
  }
};

let clauseToString = (x) => (
  (x.data)
    ? x.data.map((y) => `(${clauseToString(y)})`)
    : [
      ...x.selection.map((y) => `'${y}'`),
      ...x.exclusion.map((y) => `NOT('${y}')`)
    ]
).join((x.type === 'intersection') ? ' AND ' : ' OR ');

export default class Selection {

  constructor(query) {
    let data = (query)
      ? [{
        type: 'intersection',
        selection: [query],
        exclusion: []
      }]
      : [];
    this.selectionJSON = {type: 'intersection', data};
  }

  toJSON = () => JSON.stringify(this.selectionJSON);

  toURI = () => `/?t=${this.toJSON()}`;

  toBooleanString = () => clauseToString(this.selectionJSON);

  toFilter = () => parse(this.toBooleanString());

  getSelected = () => this.selectionJSON.data.map(s => s.selection).flat();

  getExcluded = () => this.selectionJSON.data.map(s => s.exclusion).flat();

  isSelectedOrExcluded = (criterion) => {
    if (this.getSelected().includes(criterion))
      return 'Selected';
    if (this.getExcluded().includes(criterion))
      return 'Excluded';
  }

  setJSON = (json) => {
    this.selectionJSON = JSON.parse(json);
  }

  toggleTopic = (topicID, viewpoint) => {
    let clause = this.selectionJSON.data.find(s => {
      let allTopics = [...s.selection, ...s.exclusion];
      if (allTopics.length === 0 || viewpoint[allTopics[0]] === undefined) {
        return false;
      }
      return (!viewpoint[allTopics[0]].hasOwnProperty('broader') && !viewpoint[topicID].hasOwnProperty('broader'))
        || (viewpoint[allTopics[0]].hasOwnProperty('broader') && viewpoint[allTopics[0]].broader[0].id) === (viewpoint[topicID].hasOwnProperty('broader') && viewpoint[topicID].broader[0].id);
    });
    if (!clause) {
      this.selectionJSON.data.push({type: 'intersection', selection: [topicID], exclusion: []});
    } else {
      switchPlace(clause, topicID, false, true);
      if ([...clause.selection, ...clause.exclusion].length === 0)
        this.selectionJSON.data.splice(this.selectionJSON.data.indexOf(clause), 1);
    }
  }

  toggleCriterion = (criterion, toDelete) => {
    let clause = this.selectionJSON.data.find(s => [...s.selection, ...s.exclusion].includes(criterion));
    switchPlace(clause, criterion, toDelete);
    if ([...clause.selection, ...clause.exclusion].length === 0)
      this.selectionJSON.data.splice(this.selectionJSON.data.indexOf(clause), 1);
  }

  toggleOperator = (clause) => {
    clause.type = (clause.type === 'intersection') ? 'union' : 'intersection';
  }

  getClauses = () => this.selectionJSON.data;

  getMainClause = () => this.selectionJSON;

  isEmpty = () => this.selectionJSON.data.length === 0;

  getOperator = () => this.selectionJSON.type;

}

