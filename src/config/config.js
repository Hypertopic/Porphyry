import yaml from 'yaml';

const SETTINGS = fetch('/config.yml')
  .then(x => x.text())
  .then(x => yaml.parse(x))
  .then(x => Object.assign({
    user: x.user || window.location.hostname.split('.')[0]
  }, x));

export default SETTINGS;

