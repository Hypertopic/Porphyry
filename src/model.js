class Topics {

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

/**
 * When on mobile,
 * the attributes in this list shouldn't be displayed in the left sidebar,
 * because they are already displayed elsewhere in the page.
 */
const HIDDEN_ON_MOBILE = ['creator', 'created'];

class Items {

  constructor(items) {
    this.items = items;
  }

  /**
   * @return Array of [key: string, value: string]
   */
  getAttributes = () =>
    [...new Set(
      this.items
        .map(
          x => Object.entries(x).filter(
            y => !['topic', 'resource', 'thumbnail', 'id', 'item', 'corpus', 'record', 'original', '_attachments'].includes(y[0])
          )
        )
        .reduce((x, y) => x.concat(y), [])
        .map(([x, y]) => JSON.stringify([x, y[0]]))
    )].map(JSON.parse);

  getAttributeKeys = () => [...new Set(this.getAttributes().map(x => x[0]))];

  getAttributeValues = (key) => this.getAttributes()
    .filter(([k, _]) => k === key)
    .map(([_, value]) => value);
}

export {Topics, Items, HIDDEN_ON_MOBILE};
