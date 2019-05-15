/**
 * Browser client service for the psono web client
 */

import axios from 'axios';
import action from '../actions/boundActionCreators';

let _admin_client_config = {};

function load_config() {
    return axios.get(process.env.PUBLIC_URL + '/config.json').then(response => {
        return response.data;
    });
}

/**
 * helper function to return either the config itself or if key has been specified only the config part for the key
 *
 * @param config
 * @param key
 * @returns {*}
 * @private
 */
function _get_config(config, key) {
    if (typeof key === 'undefined') {
        return config;
    }
    if (config.hasOwnProperty(key)) {
        return config[key];
    }

    return null;
}

/**
 * Loads the config (or only the part specified by the "key") fresh or from "cache"
 *
 * @param key
 * @returns {*}
 */
function get_config(key) {
    return new Promise((resolve, reject) => {
        if (Object.keys(_admin_client_config).length === 0) {
            load_config().then(admin_client_config => {
                _admin_client_config = admin_client_config;
                action.set_admin_client_config(admin_client_config);
                resolve(_get_config(admin_client_config, key));
            });
        } else {
            resolve(_get_config(_admin_client_config, key));
        }
    });
}

function get_saml_return_to_url() {
    return (
        window.location.href
            .split('/portal')
            .slice(0, 1)
            .join('/') + '/portal/saml/token/'
    );
}

const service = {
    get_saml_return_to_url,
    load_config,
    get_config
};

export default service;