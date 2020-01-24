import yaml from 'yaml';

const SETTINGS = fetch('/config.yml')
  .then(x => x.text())
  .then(x => yaml.parse(x))
  .then(x => ({
    user: x.user || window.location.hostname.split('.')[0],
    services: x.services
  }));

export default SETTINGS;

