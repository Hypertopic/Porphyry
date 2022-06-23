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
      ...x.selection.map((y) => `"${y}"`),
      ...x.exclusion.map((y) => `NOT("${y}")`)
    ]
)
  .join((x.type === 'intersection') ? ' AND ' : ' OR ')
  .replace('\'', '’');

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

  /**
   * Loads actual selection from the URI.
   *
   * @returns {Selection} current instance
   */
  static fromURI = () => {
    const selection = new Selection();
    const actualData = JSON.parse((new URLSearchParams(window.location.search)).get('t'));
    if (actualData) {
      selection.selectionJSON = actualData;
    }
    return selection;
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

  /**
   * Toggle topic selection.
   *
   * Create a new clause.
   * If there is an existing clause, move it from selection to exclusion,
   * then delete.
   *
   * @param {string} topicID Topic identifier
   * @param {object} [viewpoint] Viewpoint object
   */
  toggleTopic = (topicID, viewpoint = null) => {
    const existingClause = viewpoint ? this.selectionJSON.data.find(s => {
      const allTopics = [...s.selection, ...s.exclusion];
      if (allTopics.length === 0 || viewpoint[allTopics[0]] === undefined) {
        return false;
      }
      return (!viewpoint[allTopics[0]].hasOwnProperty('broader') && !viewpoint[topicID].hasOwnProperty('broader'))
        || (
          viewpoint[allTopics[0]].hasOwnProperty('broader')
          && viewpoint[allTopics[0]].broader[0].id
        ) === (
          viewpoint[topicID].hasOwnProperty('broader')
          && viewpoint[topicID].broader[0].id
        );
    }) : false;
    if (existingClause) {
      switchPlace(existingClause, topicID, false, true);
      if ([...existingClause.selection, ...existingClause.exclusion].length === 0)
        this.selectionJSON.data.splice(this.selectionJSON.data.indexOf(existingClause), 1);
    } else {
      this.addTopic(topicID);
    }
  }

  /**
   * Add topic to selection.
   *
   * @param {string} topicID Topic identifier
   */
  addTopic = (topicID) => {
    const existing = this.selectionJSON.data.some(e =>
      e.selection.find(topic => topic === topicID)
      || e.exclusion.find(topic => topic === topicID)
    );
    if (!existing) {
      this.selectionJSON.data.push({type: 'intersection', selection: [topicID], exclusion: []});
    }
  }

  addTopicArray = (arrayAttributes) => {
    const data = this.selectionJSON.data;
    try {
      for (let i = 0; i < data.length; i++) {
        if (data[i].selection[0].includes(':')) {
          if (data[i].selection[0].split(':')[0] === arrayAttributes[0].split(':')[0]) {
            data.splice(i, 1);
          }
        }
      }
      this.selectionJSON.data.push({type: 'union', selection: arrayAttributes, exclusion: []});
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Remove topic from selection.
   *
   * First remove topicID from clause element.
   * Then remove clause element with empty content.
   *
   * @param {string} topicID Topic identifier
   */
  removeTopic = (topicID) => {
    this.selectionJSON.data = this.selectionJSON.data
      .map(e => ({
        ...e,
        selection: e.selection.filter(s => s !== topicID),
        exclusion: e.exclusion.filter(s => s !== topicID),
      }))
      .filter(e => e.selection.length || e.exclusion.length);
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

