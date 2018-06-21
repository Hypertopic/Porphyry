import conf from './config.json';

let portfolio = conf.user;

/*
 * Get the "prop" config from config.json
 * It is either:
 * - customization[prop] for the current portfolio
 * - default[prop] if there is no custom conf
 * - the given "def" object if there is no default conf
 */
const getConfig = (prop, def) => {
    if (conf.default && conf.default[prop]) {
        Object.keys(conf.default[prop]).forEach(key => {
            def[key] = conf.default[prop][key];
        });
    }

    if (conf.customization && conf.customization[portfolio]) {
        let custom = conf.customization[portfolio];
        if (custom[prop]) {
            Object.keys(custom[prop]).forEach(key => {
                def[key] = custom[prop][key];
            });
        }
    }
    return def;
}

export default getConfig;

