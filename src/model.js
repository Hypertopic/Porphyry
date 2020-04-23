export class Topics {

  /**
   * topics:
   *  [ID]:
   *    name: STRING
   *    broader:
   *      -
   *        id: ID
   */
  constructor(topics) {
    this.topics = topics;
  }

  getPath = (id) => {
    let topic = this.topics[id];
    let broader = topic && topic.broader && topic.broader[0] && topic.broader[0].id;
    return ((broader) ? this.getPath(broader) : '') + topic.name[0] + ' > ';
  }

  getAllPaths = () => Object.keys(this.topics)
    .map(x => ({id: x, name: this.getPath(x).slice(0, -3)}));

}
